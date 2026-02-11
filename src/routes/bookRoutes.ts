import { Router } from "express";
import {
  addAsFavorite,
  buyBook,
  deleteBook,
  getAllBooks,
  getBookById,
  registerBook,
  removeFromFavorites,
  updateBook,
} from "../controllers/bookController.js";
import upload from "../middleware/upload.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";
import { getEpub } from "../controllers/epubController.js";

const router = Router();

router.put("/favorite/:id", authenticateAccessToken, addAsFavorite);
router.delete("/favorite/:id", authenticateAccessToken, removeFromFavorites);
router.put("/buy/:id", authenticateAccessToken, buyBook);
router.get("/epub/:id", authenticateAccessToken, getEpub);

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", authenticateAccessToken, upload.single("epub"), registerBook);
router.put("/:id", authenticateAccessToken, upload.single("epub"), updateBook);
router.delete("/:id", authenticateAccessToken, deleteBook);

export default router;
