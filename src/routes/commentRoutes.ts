import { Router } from "express";
import {
  getCommentsByBook,
  addComment,
  removeComment,
} from "../controllers/commentController.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";

const router = Router();

router.get("/book/:bookId", getCommentsByBook);
router.post("/", authenticateAccessToken, addComment);
router.delete("/:id", authenticateAccessToken, removeComment);

export default router;
