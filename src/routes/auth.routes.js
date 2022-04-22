const authRouter = require("express").Router();
const { userController, authController, globalController } = require("../controllers");

// authRouter.get("/", authController.verifyToken, userController.getOneById);
// authRouter.post("/login", userController.verifyCredentials, authController.createToken);

authRouter.post("/login", authController.login, authController.createAccessAndRefreshToken);
authRouter.post("/refresh_token", authController.verifyRefreshToken, userController.getOneById, authController.createAccessToken);
authRouter.post("/logout", authController.verifyAccessToken, authController.deleteRefreshToken);

authRouter.post(
  "/activate/:token",
  authController.verifyActivationToken,
  globalController.validateInputPassword,
  userController.createNewPassword,
  userController.getOneById,
);
authRouter.post(
  "/new-password/:token",
  authController.verifyResetToken,
  globalController.validateInputPassword,
  userController.createNewPassword,
  userController.getOneById,
);

module.exports = authRouter;
