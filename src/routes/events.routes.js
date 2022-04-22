const eventRouter = require("express").Router();
const { eventController, globalController, pictureController, priceController } = require("../controllers");

eventRouter.get("/", eventController.getManyEvents);
eventRouter.get("/:id", globalController.verifyInputId, eventController.verifyIfEventIdExists, eventController.getOneEventById);
eventRouter.get(
  "/:id/pictures",
  globalController.verifyInputId,
  eventController.verifyIfEventIdExists,
  pictureController.getManyPicturesByClubEventId,
);
eventRouter.post("/", eventController.createOneEvent, eventController.getOneEventById);
eventRouter.put("/:id", globalController.verifyInputId, eventController.verifyIfEventIdExists, eventController.updateOneEventById);
eventRouter.delete(
  "/:id",
  globalController.verifyInputId,
  eventController.verifyIfEventIdExists,
  // pictureController.deleteEventPictureFile,
  eventController.deleteOneEventById,
);

eventRouter.get("/:id/prices", globalController.verifyInputId, eventController.verifyIfEventIdExists, priceController.getManyPricesByClubEventId);
eventRouter.get(
  "/:id/pictures",
  globalController.verifyInputId,
  pictureController.verifyIfPictureIdExist,
  pictureController.getManyPicturesByClubEventId,
);
eventRouter.get("/:id/details", globalController.verifyInputId, eventController.verifyIfEventIdExists, eventController.getOnePublicEvent);

module.exports = eventRouter;
