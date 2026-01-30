import { Router } from "express";
import { registerUser, getUserById } from "../controllers/userController.js";

const router = Router();

router.post("/", registerUser);
router.get("/:id", getUserById);

export default router;
