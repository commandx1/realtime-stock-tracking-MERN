const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.memoryStorage({
    destination: (req, file, cb) => {
      cb(null, "");
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Geçersiz dosya tipi!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
