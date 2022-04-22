const multer = require("multer");
const fs = require("fs");
const { Picture } = require("../models");

const uploadUserAvatarFile = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "public/pictures/avatars");
    },
    filename: (_, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage }).single("avatarFile");

  upload(req, res, (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      req.picture = JSON.parse(req.body.avatarData);
      next();
    }
  });
};

const deleteUserAvatarFile = async (req, res, next) => {
  const { id } = req.params;
  const user_id = id;

  try {
    if (await Picture.UserIdDoExist(user_id)) {
      const [results] = await Picture.findAvatarByUserId(user_id);
      fs.unlink(`public/pictures/avatars/${results[0].file_name}`, (err) => {
        if (err) throw err;
      });
      next();
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const uploadEventPictureFile = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "public/pictures/club-events");
    },
    filename: (_, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage }).single("eventPictureFile");

  upload(req, res, (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      req.picture = JSON.parse(req.body.eventPictureData);
      next();
    }
  });
};

const deleteEventPictureFile = async (req, res, next) => {
  const { id } = req.params;
  const club_event_id = id;

  try {
    if (await Picture.eventIdExists(club_event_id)) {
      const [results] = await Picture.findEventPictureByEventId(club_event_id);
      fs.unlink(`public/pictures/club-events/${results[0].file_name}`, (err) => {
        if (err) throw err;
      });
      next();
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getEventPictureByEventId = async (req, res) => {
  const { id } = req.params;
  const club_event_id = id;

  try {
    const [results] = await Picture.findEventPictureByEventId(club_event_id);
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteEventPictureBeforeUpdate = async (req, res, next) => {
  const { id } = req.params;
  const club_event_id = id;

  try {
    if (await Picture.eventIdExists(club_event_id)) {
      const [results] = await Picture.findEventPictureByEventId(club_event_id);
      fs.unlink(`public/pictures/events/${results[0].file_name}`, (err) => {
        if (err) throw err;
      });
      await Picture.deleteOnePictureById(results[0].id);
      next();
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// basic CRUD controllers

const createOnePicture = async (req, res, next) => {
  let { file_name, picture_description, author, is_public, is_poster, user_id, club_event_id } = req.body;

  if (req.file?.filename) {
    file_name = req.file.filename;
    picture_description = req.picture.description;
    author = req.picture.author;
    is_public = req.picture.isPublic;
    is_poster = req.picture.isPoster;
    user_id = req.picture.userId;
    club_event_id = req.picture.eventId;
  }
  try {
    const [results] = await Picture.createOnePicture({ file_name, picture_description, author, is_public, is_poster, user_id, club_event_id });
    req.id = results.insertId;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getManyPictures = async (req, res) => {
  try {
    const [results] = await Picture.findManyPictures();
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAvatarByUserId = async (req, res) => {
  const { id } = req.params;
  const user_id = id;

  try {
    const [results] = await Picture.findAvatarByUserId(user_id);
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getManyPicturesByClubEventId = async (req, res) => {
  const { id } = req.params;
  const club_event_id = id;

  try {
    const [results] = await Picture.findPictureByClubEventId(club_event_id);
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// deleteAvatarByUserID delete also the file of avatar in public/pictures/avatars
const deleteAvatarBeforeUpdate = async (req, res, next) => {
  const { id } = req.params;
  const user_id = id;

  try {
    if (await Picture.UserIdDoExist(user_id)) {
      const [results] = await Picture.findAvatarByUserId(user_id);
      fs.unlink(`public/pictures/avatars/${results[0].file_name}`, (err) => {
        if (err) throw err;
      });
      await Picture.deleteOnePictureById(results[0].id);
      next();
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOnePictureById = async (req, res) => {
  const { id } = req.id ? req : req.params;
  const statusCode = req.id ? 201 : 200;
  try {
    const [results] = await Picture.findOnePictureById(id);
    res.status(statusCode).json(results[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateOnePictureById = async (req, res) => {
  const { file_name, picture_description, author, is_public, is_poster, user_id, club_event_id } = req.body;
  const { id } = req.params;

  if (!file_name && !picture_description && !author && !is_public && !is_poster && !user_id && !club_event_id) {
    res.status(400).send("Vous n'avez pas remplis tous champs obligatoires!");
  } else {
    const picture = {};
    if (file_name) {
      picture.file_name = file_name;
    }
    if (picture_description) {
      picture.picture_description = picture_description;
    }
    if (author) {
      picture.author = author;
    }
    if (is_public) {
      picture.is_public = is_public;
    }
    if (is_poster) {
      picture.is_poster = is_poster;
    }
    if (user_id) {
      picture.user_id = user_id;
    }
    if (club_event_id) {
      picture.club_event_id = club_event_id;
    }
    try {
      await Picture.updateOnePictureById(picture, id);
      res.sendStatus(204);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};

const verifyIfPictureIdExist = async (req, res, next) => {
  const { id } = req.params;
  if (await Picture.idDoNotExists(id)) {
    res.status(404).send(`L'image avec id: ${id} n'a pas été trouvé`);
  } else {
    next();
  }
};

const deleteOnePictureById = async (req, res) => {
  const { id } = req.params;
  try {
    await Picture.deleteOnePictureById(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  createOnePicture,
  getManyPictures,
  getOnePictureById,
  getManyPicturesByClubEventId,
  updateOnePictureById,
  verifyIfPictureIdExist,
  deleteOnePictureById,
  getAvatarByUserId,
  uploadUserAvatarFile,
  deleteAvatarBeforeUpdate,
  deleteUserAvatarFile,
  uploadEventPictureFile,
  deleteEventPictureFile,
  deleteEventPictureBeforeUpdate,
  getEventPictureByEventId,
};
