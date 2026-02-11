import { Router } from "express";
import {
  getReviewsByBookId,
  registerReview,
} from "../controllers/reviewController.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:bookId", getReviewsByBookId);
router.post("/:bookId", authenticateAccessToken, registerReview);

export default router;
