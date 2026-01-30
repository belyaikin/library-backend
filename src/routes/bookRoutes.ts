import { Router } from "express";
import { getBookById, registerBook } from "../controllers/bookController.js";

const router = Router();

router.get("/:id", getBookById);
router.post("/", registerBook);

export default router;
