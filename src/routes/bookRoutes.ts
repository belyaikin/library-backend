import { Router } from "express";
import {
  buyBook,
  getBookById,
  registerBook,
} from "../controllers/bookController.js";
import upload from "../middleware/upload.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";
import { getEpub } from "../controllers/epubController.js";

const router = Router();

router.get("/:id", authenticateAccessToken, getBookById);
router.post("/", authenticateAccessToken, upload.single("epub"), registerBook);
router.put("/buy", authenticateAccessToken, buyBook);
router.get("/epub/:id", authenticateAccessToken, getEpub);

export default router;
