import { Router } from "express";
import {
  registerUser,
  getUserById,
  updateUser,
  unregisterUser,
} from "../controllers/userController.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", registerUser);
router.get("/:id", getUserById);
router.put("/:id", authenticateAccessToken, updateUser);
router.delete("/:id", authenticateAccessToken, unregisterUser);

export default router;
