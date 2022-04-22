const { Event, Picture, Price } = require("../models");

// CRUD

const createOneEvent = async (req, res, next) => {
  const { title, event_date, event_description, event_locality, event_type } = req.body;
  try {
    const [results] = await Event.createOneEvent({ title, event_date, event_description, event_locality, event_type });
    req.id = results.insertId;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getManyEvents = async (req, res) => {
  const { is_public } = req.query;
  try {
    const [events] = await Event.findManyEvents();
    events.forEach((evenement) => {
      /* eslint-disable no-param-reassign */
      evenement.pictures = [];
      evenement.prices = [];
      /* eslint-disable no-param-reassign */
      return events;
    });
    const [pictures] = await Event.findManyPictures(is_public);
    if (is_public === "true") {
      pictures.forEach((picture) => {
        events.map((event) => {
          if (picture.club_event_id === event.id) {
            event.pictures.push(picture);
          }
          return events;
        });
      });
    }
    const [prices] = await Event.findManyPrices(is_public);
    if (is_public === "true") {
      prices.forEach((price) => {
        events.map((event) => {
          if (price.club_event_id === event.id) {
            event.prices.push(price);
          }
          return events;
        });
      });
    }
    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getOneEventById = async (req, res) => {
  const { id } = req.id ? req : req.params;
  const statusCode = req.id ? 201 : 200;
  try {
    const [results] = await Event.findOneEventById(id);
    res.status(statusCode).json(results[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOnePublicEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const [[event]] = await Event.findOneEventById(id);
    if (event) {
      event.pictures = [];
      event.prices = [];

      const [pictures] = await Picture.findPictureByClubEventId(id);
      pictures.forEach((picture) => {
        if (picture.is_public === 1) {
          event.pictures.push(picture);
        }
      });
      const [prices] = await Price.findPriceByClubEventId(id);
      prices.forEach((price) => {
        if (price.is_public === 1) {
          event.prices.push(price);
        }
      });
      return res.status(200).json(event);
    }
    return res.status(404).send("L'élément n'existe pas !");
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateOneEventById = async (req, res) => {
  const { title, event_date, event_description, event_locality, event_type } = req.body;
  const { id } = req.params;

  if (!title && !event_date && !event_locality && !event_type) {
    res.status(400).send("Vous devez fournir au moins une donnée à mettre à jour!");
  } else {
    const event = {};
    if (title) {
      event.title = title;
    }
    if (event_date) {
      event.event_date = event_date;
    }
    if (event_description) {
      event.event_description = event_description;
    }
    if (event_locality) {
      event.event_locality = event_locality;
    }
    if (event_type) {
      event.event_type = event_type;
    }
    try {
      const [result] = await Event.updateOneEventById(event, id);
      if (result.affectedRows === 0) {
        res.status(404).send(`L'événement avec id: ${id} n'a pas été trouvé!`);
      } else {
        res.sendStatus(204);
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};

const verifyInputId = (req, res, next) => {
  const { id } = req.params;
  if (Number.isNaN(parseInt(id, 10))) {
    res.status(400).send("Vous devez fournir un Id au bon format !");
  } else {
    next();
  }
};

const verifyIfEventIdExists = async (req, res, next) => {
  const { id } = req.params;
  if (await Event.idDoNotExists(id)) {
    res.status(404).send(`L'événement avec id: ${id} n'a pas été trouvé!`);
  } else {
    next();
  }
};

const deleteOneEventById = async (req, res) => {
  const { id } = req.params;
  try {
    await Event.deleteOneEventById(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  verifyIfEventIdExists,
  createOneEvent,
  getOneEventById,
  updateOneEventById,
  deleteOneEventById,
  getManyEvents,
  verifyInputId,
  getOnePublicEvent,
};
