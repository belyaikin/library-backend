import { Router } from "express";
import {
  buyBook,
  deleteBook,
  getAllBooks,
  getBookById,
  registerBook,
  updateBook,
} from "../controllers/bookController.js";
import upload from "../middleware/upload.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";
import { getEpub } from "../controllers/epubController.js";

const router = Router();

router.get("/", getAllBooks)
router.get("/:id", getBookById);
router.post("/", authenticateAccessToken, upload.single("epub"), registerBook);
router.put("/:id", authenticateAccessToken, upload.single("epub"), updateBook);
router.put("/buy", authenticateAccessToken, buyBook);
router.get("/epub/:id", authenticateAccessToken, getEpub);
router.delete("/:id", authenticateAccessToken, deleteBook)

export default router;
