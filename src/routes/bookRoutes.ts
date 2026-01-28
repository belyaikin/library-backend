import { Router } from "express";
import { getBookById } from "../controllers/bookController.js";

const router = Router();

router.get("/:id", getBookById);

export default router;
