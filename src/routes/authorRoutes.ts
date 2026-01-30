import { Router } from "express";
import {
  getAuthorById,
  registerAuthor,
} from "../controllers/authorController.js";

const router = Router();

router.get("/", getAuthorById);
router.post("/", registerAuthor);

export default router;
