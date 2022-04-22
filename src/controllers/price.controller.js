const { Price } = require("../models");

// CRUD

const createOnePrice = async (req, res, next) => {
  const { title_price, price, is_public, club_event_id } = req.body;
  try {
    const [results] = await Price.createOnePrice({ title_price, price, is_public, club_event_id });
    req.id = results.insertId;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getManyPrices = async (req, res) => {
  try {
    const [results] = await Price.findManyPrices();
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOnePriceById = async (req, res) => {
  const { id } = req.id ? req : req.params;
  const statusCode = req.id ? 201 : 200;
  try {
    const [results] = await Price.findOnePriceById(id);
    res.status(statusCode).json(results[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getManyPricesByClubEventId = async (req, res) => {
  const { id } = req.params;
  const club_event_id = id;

  try {
    const [results] = await Price.findPriceByClubEventId(club_event_id);
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateOnePriceById = async (req, res) => {
  const { title_price, price, is_public, club_event_id } = req.body;
  const { id } = req.params;

  if (!title_price && !price && is_public && club_event_id) {
    res.status(400).send("Vous devez fournir au moins une donnée à mettre à jour!");
  } else {
    const priceEvent = {};
    if (title_price) {
      priceEvent.title_price = title_price;
    }
    if (price) {
      priceEvent.price = price;
    }
    if (is_public) {
      priceEvent.is_public = is_public;
    }
    if (club_event_id) {
      priceEvent.club_event_id = club_event_id;
    }
    try {
      const [result] = await Price.updateOnePriceById(priceEvent, id);
      if (result.affectedRows === 0) {
        res.status(404).send(`Le prix avec id: ${id} n'a pas été trouvé!`);
      } else {
        res.sendStatus(204);
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};

const verifyIfPriceIdExists = async (req, res, next) => {
  const { id } = req.params;
  if (await Price.idDoNotExists(id)) {
    res.status(404).send(`Le prix avec id: ${id} n'a pas été trouvé!`);
  } else {
    next();
  }
};

const deleteOnePriceById = async (req, res) => {
  const { id } = req.params;
  try {
    await Price.deleteOnePriceById(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  verifyIfPriceIdExists,
  createOnePrice,
  getOnePriceById,
  getManyPricesByClubEventId,
  updateOnePriceById,
  deleteOnePriceById,
  getManyPrices,
};
