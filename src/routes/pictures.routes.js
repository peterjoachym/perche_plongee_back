const picturesRouter = require("express").Router();
const { pictureController } = require("../controllers");

picturesRouter.get("/", pictureController.getManyPictures);
picturesRouter.get("/:id", pictureController.verifyIfPictureIdExist, pictureController.getOnePictureById);
picturesRouter.post("/", pictureController.createOnePicture, pictureController.getOnePictureById);
picturesRouter.put("/:id", pictureController.verifyIfPictureIdExist, pictureController.getOnePictureById, pictureController.updateOnePictureById);
picturesRouter.delete("/:id", pictureController.verifyIfPictureIdExist, pictureController.deleteOnePictureById);

picturesRouter.post("/avatars", pictureController.uploadUserAvatarFile, pictureController.createOnePicture, pictureController.getOnePictureById);
picturesRouter.put(
  "/avatars/:id",
  pictureController.deleteAvatarBeforeUpdate,
  pictureController.uploadUserAvatarFile,
  pictureController.createOnePicture,
  pictureController.getOnePictureById,
);

picturesRouter.post("/events", pictureController.uploadEventPictureFile, pictureController.createOnePicture, pictureController.getOnePictureById);
picturesRouter.put(
  "/events/:id",
  pictureController.deleteEventPictureBeforeUpdate,
  pictureController.uploadEventPictureFile,
  pictureController.createOnePicture,
  pictureController.getOnePictureById,
);
module.exports = picturesRouter;
