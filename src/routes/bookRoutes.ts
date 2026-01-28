import { Router } from "express";
import { getBookById } from "../controllers/bookController";

const router = Router();

router.get("/:id", getBookById);

export default router;
