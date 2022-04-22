const pricesRouter = require("express").Router();
const { priceController, globalController } = require("../controllers");

pricesRouter.get("/", priceController.getManyPrices);
pricesRouter.get("/:id", globalController.verifyInputId, priceController.verifyIfPriceIdExists, priceController.getOnePriceById);

pricesRouter.post("/", priceController.createOnePrice, priceController.getOnePriceById);
pricesRouter.put("/:id", globalController.verifyInputId, priceController.verifyIfPriceIdExists, priceController.updateOnePriceById);
pricesRouter.delete("/:id", globalController.verifyInputId, priceController.verifyIfPriceIdExists, priceController.deleteOnePriceById);

module.exports = pricesRouter;
