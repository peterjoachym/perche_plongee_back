const userController = require("./user.controller");

const authController = require("./auth.controller");
const globalController = require("./global.controller");
const eventController = require("./event.controllers");
const pictureController = require("./picture.controllers");
const priceController = require("./price.controller");
const articleController = require("./article.controller");
const documentController = require("./document.controller");

module.exports = {
  userController,
  eventController,
  authController,
  globalController,
  pictureController,
  priceController,
  articleController,
  documentController,
};
