import { Router } from "express";
import {
  getReviewsByBookId,
  registerReview,
  unregisterReview,
} from "../controllers/reviewController.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:bookId", getReviewsByBookId);
router.post("/", authenticateAccessToken, registerReview);
router.delete("/:id", authenticateAccessToken, unregisterReview);

export default router;
