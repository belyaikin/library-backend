import config from "../config/config.js";
import multer from "multer";
import multerS3 from "multer-s3";
import s3client from "../config/s3client.js";

const s3Storage = multerS3({
  s3: s3client,
  bucket: config.bucket_name,

  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },

  key: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export default multer({
  storage: s3Storage,
});
