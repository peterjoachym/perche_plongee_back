const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// verifing controllers first

const verifyIfIdExist = async (req, res, next) => {
  const { id } = req.params;
  if (await User.idDoNotExists(id)) {
    res.status(404).send(`L'Utilisateur avec id: ${id} n'a pas été trouvé!`);
  } else {
    next();
  }
};

const verifyIfEmailAvailable = async (req, res, next) => {
  const { email } = req.body;
  if (await User.emailAlreadyExists(email)) {
    res.status(401).send("L'adresse email existe déjà!");
  } else {
    next();
  }
};

const verifyEmailUser = async (req, res, next) => {
  const { email } = req.body;
  if (!(await User.emailAlreadyExists(email))) {
    res.status(401).send("L'utilisateur n'existe pas");
  } else {
    next();
  }
};

const verifyCredentials = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const [results] = await User.findOneByEmail(email);
    if (results.length === 0) {
      res.status(401).send("Email ou le mot de passe erronné!");
    } else {
      const { hashed_password } = results[0];
      const validPassword = await User.verifyPassword(password, hashed_password);
      if (validPassword) {
        delete results[0].hashed_password;
        const user = results[0];
        req.user = user;
        next();
      } else {
        res.status(401).send("Email ou le mot de passe erronné!");
      }
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Config nodemailer and OAuth2 tio use Gmail
const { MAILING_SERVICE_USER, CLIENT_ID_GMAIL_OAUTH, CLIENT_SECRET_GMAIL_OAUTH, CLIENT_REFRESH_TOKEN_GMAIL_OAUTH, CLIENT_GMAIL_REDIRECT_URI } =
  process.env;

const OAuth2Client = new google.auth.OAuth2(CLIENT_ID_GMAIL_OAUTH, CLIENT_SECRET_GMAIL_OAUTH, CLIENT_GMAIL_REDIRECT_URI);
OAuth2Client.setCredentials({ refresh_token: CLIENT_REFRESH_TOKEN_GMAIL_OAUTH });

// link in html body need to be changed in order of front path to activation/reset password section !!!!!
const sendActivationEmail = async (req, res, next) => {
  const { firstname, lastname, email } = req.body;
  const { id } = req.id ? req : req.params;
  const activationToken = jwt.sign({ id }, process.env.JWT_ACTIVATION, { expiresIn: "48h" });
  const activationEmail = {
    from: "account-activation-noreply@gmail.com",
    to: email,
    subject: "Activation de votre compte membre Perche Plongée",
    html: `<h2>Bonjour ${firstname} ${lastname}</h2><br>
    <p>Ceci est un mail généré automatiquement. Il sert à activer votre compte membre et créer votre mot de passe.</br>
       Veuillez cliquer sur le lien ci-dessus pour poursuiver la procédure:</p><br><br>
       <a href=${process.env.CLIENT_ORIGIN}/account-activate/${activationToken}>${process.env.CLIENT_ORIGIN}/account-activate/${activationToken}</a><p><br><br>
       <p>Ce lien est valable 48 heures</p>`,
  };

  try {
    // Generate the accessToken on the fly
    const accessToken = await OAuth2Client.getAccessToken();

    // Create the email envelope (transport)
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: MAILING_SERVICE_USER,
        clientId: CLIENT_ID_GMAIL_OAUTH,
        clientSecret: CLIENT_SECRET_GMAIL_OAUTH,
        refreshToken: CLIENT_REFRESH_TOKEN_GMAIL_OAUTH,
        accessToken,
      },
    });

    await transport.sendMail(activationEmail);
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;
  const [results] = await User.findOneByEmail(email);
  const { id, firstname, lastname } = results[0];
  const activationToken = jwt.sign({ id }, process.env.JWT_RESET, { expiresIn: "15m" });
  const resetPasswordEmail = {
    from: "account-activation-noreply@gmail.com",
    to: email,
    subject: "Mot de passe oublié membre Perche Plongée",
    html: `<h2>Bonjour ${firstname} ${lastname}</h2><br>
    <p>Ceci est un mail généré automatiquement. Il sert à réactiver votre votre mot de passe oublié.</br>
       Veuillez cliquer sur le lien ci-dessus pour poursuivre la procédure:</p><br><br>
       <a href=${process.env.CLIENT_ORIGIN}/new-password-activate/${activationToken}>${process.env.CLIENT_ORIGIN}/new-password-activate/${activationToken}</a><p><br><br>
       <p>Ce lien est valable 15 minutes!</p>
       <p>Si vous n'avez pas intitié cette action ne tenez pas compte de ce mail !</p>`,
  };

  try {
    // Generate the accessToken on the fly
    const accessToken = await OAuth2Client.getAccessToken();

    // Create the email envelope (transport)
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: MAILING_SERVICE_USER,
        clientId: CLIENT_ID_GMAIL_OAUTH,
        clientSecret: CLIENT_SECRET_GMAIL_OAUTH,
        refreshToken: CLIENT_REFRESH_TOKEN_GMAIL_OAUTH,
        accessToken,
      },
    });

    await transport.sendMail(resetPasswordEmail);
    res.status(200).send("Email enovyé avec succès !");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createNewPassword = async (req, res, next) => {
  const { password } = req.body;
  const { id } = req.id ? req : req.params;
  const hashedPassword = await User.hashPassword(password);
  const user = { hashed_password: hashedPassword };
  try {
    await User.updateOneById(user, id);
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// classical CRUD controllers

async function createNewUser(req, res, next) {
  const { firstname, lastname, tel_number, email, club_role, website_admin } = req.body;
  try {
    const [results] = await User.createOne({ firstname, lastname, tel_number, email, club_role, website_admin });
    req.id = results.insertId;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const getMany = async (req, res) => {
  try {
    const [results] = await User.findMany();
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getTrainers = async (req, res) => {
  try {
    const [results] = await User.findManyTrainers();
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// const getOneById = async (req, res) => {
//   let { id } = req.id ? req : req.params;
//   if (req.user) {
//     id = req.user.id;
//   }
//   const statusCode = req.id ? 201 : 200;
//   try {
//     const [results] = await User.findOneById(id);
//     console.log(results);
//     delete results[0].hashed_password;
//     res.status(statusCode).json(results[0]);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// };

const getOneById = async (req, res, next) => {
  let { id } = req.id ? req : req.params;
  if (req.user) {
    id = req.user.id;
  }
  try {
    const [results] = await User.findOneById(id);
    if (results.length > 0 && !req.user && !req.id) {
      res.json(results[0]);
    } else if (results.length > 0 && (req.user || req.id)) {
      delete results[0].hashed_password;
      const [user] = results;
      if (req.user) {
        req.user = user;
        next();
      } else {
        res.json(user);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateOneById = async (req, res) => {
  const { firstname, lastname, tel_number, email, club_role, website_admin } = req.body;
  const { id } = req.params;

  if (!firstname && !lastname && !tel_number && !email && !club_role && !website_admin) {
    res.status(400).send("Vous devez fournir au moins une donnée à mettre à jour!");
  } else {
    const user = {};
    if (firstname) {
      user.firstname = firstname;
    }
    if (lastname) {
      user.lastname = lastname;
    }
    if (tel_number) {
      user.tel_number = tel_number;
    }
    if (email) {
      user.email = email;
    }
    if (club_role) {
      user.club_role = club_role;
    }
    if (website_admin) {
      user.website_admin = website_admin;
    }
    try {
      await User.updateOneById(user, id);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};

const deleteOneById = async (req, res) => {
  const { id } = req.params;
  try {
    await User.deleteOneById(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  verifyIfEmailAvailable,
  verifyEmailUser,
  createNewUser,
  getOneById,
  updateOneById,
  verifyIfIdExist,
  deleteOneById,
  getMany,
  getTrainers,
  verifyCredentials,
  createNewPassword,
  sendActivationEmail,
  sendResetPasswordEmail,
};
