import { Router } from "express";
import {
  getReviewsByBook,
  getUserReviewCount,
  addReview,
  removeReview,
} from "../controllers/reviewController.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";

const router = Router();

router.get("/my/count", authenticateAccessToken, getUserReviewCount);
router.get("/book/:bookId", getReviewsByBook);
router.post("/", authenticateAccessToken, addReview);
router.delete("/:id", authenticateAccessToken, removeReview);

export default router;
