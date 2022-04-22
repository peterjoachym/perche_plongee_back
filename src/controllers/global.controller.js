const Yup = require("yup");

const verifyInputId = (req, res, next) => {
  const { id } = req.params;
  if (Number.isNaN(parseInt(id, 10))) {
    res.status(400).send("Vous devez entrer l'Id au bon format!");
  } else {
    next();
  }
};

const validateInputData = async (req, res, next) => {
  const schema = Yup.object().shape({
    firstname: Yup.string()
      .min(2, "Le Prénom doit contenir au moins 2 caractères!")
      .max(80, "Le Prénom ne doit pas dépasser 80 charactères!")
      .required("Vous devez fournir un prénom!"),
    lastname: Yup.string().min(2, "Le NOM doit contenir au moins 2 caractères!").required("Vous devez fournir le NOM!"),
    tel_number: Yup.string()
      .min(10, "Le numéro de téléphone doit contenir 10 chiffres!")
      .max(10, "Le numéro de téléphone doit contenir 10 chiffres!"),
    email: Yup.string().email("Veuillez entrez un email au bon format!").required("Vous devez entrez un Email!"),
    club_role: Yup.string().min(4, "Club role doit contenir au moins 4 caractères"),
    website_admin: Yup.number().required().integer().min(0).max(1),
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const validateUpdateInputData = async (req, res, next) => {
  const schema = Yup.object().shape({
    firstname: Yup.string().max(80, "Le Prénom doit contenir au moins 2 caractères!"),
    lastname: Yup.string().max(80, "Le NOM doit contenir au moins 2 caractères!"),
    tel_number: Yup.string().max(10, "Le numéro de téléphone doit contenir 10 chiffres!"),
    email: Yup.string().email("Veilleuz entrez un email au bon format!"),
    club_role: Yup.string().min(4, "Club role must have at least 4 characters"),
    website_admin: Yup.number().integer().min(0).max(1),
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const validateInputPassword = async (req, res, next) => {
  const schema = Yup.object().shape({
    password: Yup.string()
      .required("Vous devez entrez un mot de passe.")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
        "Le mot de passe doit contenir au moins une lettre en majuscule de l'alphabet latin, une lettre minuscule de l'alphabet latin, un chiffre et un caractère spécial!",
      ),
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const validateInputPicture = async (req, res, next) => {
  const schema = Yup.object().shape({
    file_name: Yup.string().required("Vous devez entrez le nom du fichier"),
    picture_description: Yup.string().required("Vous devez remplir la  description de l'image"),
  });

  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  verifyInputId,
  validateInputData,
  validateInputPassword,
  validateInputPicture,
  validateUpdateInputData,
};
