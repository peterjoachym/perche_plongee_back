const documentRouter = require("express").Router();
const { globalController, documentController } = require("../controllers");

documentRouter.get("/", documentController.getManyDocuments);
documentRouter.get("/:id", globalController.verifyInputId, documentController.verifyIfDocumentIdExist, documentController.getOneDocumentById);
documentRouter.post("/", documentController.uploadDocumentFile, documentController.createOneDocument, documentController.getOneDocumentById);
documentRouter.delete(
  "/:id",
  globalController.verifyInputId,
  documentController.verifyIfDocumentIdExist,
  documentController.deleteDocumentFile,
  documentController.deleteOneDocumentById,
);

module.exports = documentRouter;
