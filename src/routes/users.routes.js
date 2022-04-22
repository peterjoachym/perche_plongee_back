const usersRouter = require("express").Router();
const { userController, globalController, pictureController } = require("../controllers");

usersRouter.get("/", userController.getMany);

usersRouter.get("/trainers", userController.getTrainers);

usersRouter.get("/:id", globalController.verifyInputId, userController.verifyIfIdExist, userController.getOneById);

usersRouter.get("/:id/avatars", globalController.verifyInputId, userController.verifyIfIdExist, pictureController.getAvatarByUserId);

usersRouter.post(
  "/",
  globalController.validateInputData,
  userController.verifyIfEmailAvailable,
  userController.createNewUser,
  userController.sendActivationEmail,
  userController.getOneById,
);

usersRouter.post("/reset-password", userController.verifyEmailUser, userController.sendResetPasswordEmail);

usersRouter.put(
  "/:id",
  globalController.verifyInputId,
  userController.verifyIfIdExist,
  globalController.validateUpdateInputData,
  userController.updateOneById,
);

usersRouter.delete(
  "/:id",
  globalController.verifyInputId,
  userController.verifyIfIdExist,
  pictureController.deleteUserAvatarFile,
  userController.deleteOneById,
);

module.exports = usersRouter;
