import { Router } from "express";
import {
  getAuthorById,
  registerAuthor,
} from "../controllers/authorController.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:id", getAuthorById);
router.post("/", authenticateAccessToken, registerAuthor);

export default router;
