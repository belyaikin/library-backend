import config from "../config/config.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: config.epubLocation,

  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

export default multer({
  storage: storage,
  fileFilter: (_, file, cb) => {
    cb(null, file.mimetype === "application/epub+zip");
  },
});
