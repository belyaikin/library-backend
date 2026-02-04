import { Router } from "express";
import { getBookById, registerBook } from "../controllers/bookController.js";
import upload from "../middleware/upload.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:id", authenticateAccessToken, getBookById);
router.post("/", authenticateAccessToken, upload.single("epub"), registerBook);

export default router;
