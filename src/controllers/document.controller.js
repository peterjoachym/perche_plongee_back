const multer = require("multer");
const fs = require("fs");
const { Document } = require("../models");

const uploadDocumentFile = (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "public/documents");
    },
    filename: (_, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage }).single("documentFile");

  upload(req, res, (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      req.document = JSON.parse(req.body.documentData);
      next();
    }
  });
};

const deleteDocumentFile = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [results] = await Document.findOneById(id);
    fs.unlink(`public/documents/${results[0].file_name}`, (err) => {
      if (err) throw err;
    });
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getManyDocuments = async (req, res) => {
  const { doc_type } = req.query;
  try {
    const [results] = await Document.getManyDocuments(doc_type);
    res.json(results);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOneDocumentById = async (req, res) => {
  const { id } = req.id ? req : req.params;
  const statusCode = req.id ? 201 : 200;
  try {
    const [results] = await Document.findOneById(id);
    res.status(statusCode).json(results[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const verifyIfDocumentIdExist = async (req, res, next) => {
  const { id } = req.params;
  if (await Document.idDoNotExists(id)) {
    res.status(404).send(`Document avec id: ${id} n'a pas été trouvé`);
  } else {
    next();
  }
};

const createOneDocument = async (req, res, next) => {
  let { file_name, doc_name, doc_type } = req.body;

  if (req.file?.filename) {
    file_name = req.file.filename;
    doc_name = req.document.documentName;
    doc_type = req.document.documentType;
  }
  try {
    const [results] = await Document.createOneDocument({ file_name, doc_name, doc_type });
    req.id = results.insertId;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteOneDocumentById = async (req, res) => {
  const { id } = req.params;
  try {
    await Document.deleteOneDocumentById(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getManyDocuments,
  getOneDocumentById,
  verifyIfDocumentIdExist,
  uploadDocumentFile,
  createOneDocument,
  deleteDocumentFile,
  deleteOneDocumentById,
};
