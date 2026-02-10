import { Router } from "express";
import {
  getAuthorById,
  getAuthors,
  registerAuthor,
  unregisterAuthor,
  updateAuthor,
} from "../controllers/authorController.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAuthors);
router.get("/:id", getAuthorById);
router.post("/", authenticateAccessToken, registerAuthor);
router.put(":id", authenticateAccessToken, updateAuthor);
router.delete("/:id", authenticateAccessToken, unregisterAuthor);

export default router;
