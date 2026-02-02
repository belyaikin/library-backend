import { Router } from "express";
import { getBookById, registerBook } from "../controllers/bookController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/:id", getBookById);
router.post("/", upload.single("epub"), registerBook);

export default router;
