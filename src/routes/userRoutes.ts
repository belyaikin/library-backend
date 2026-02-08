import { Router } from "express";
import { registerUser, getUserById, updateUser, unregisterUser, getAllUsers, changeUserRole } from "../controllers/userController.js";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favoritesController.js";
import authenticateAccessToken from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticateAccessToken, getAllUsers);
router.post("/", registerUser);
router.put("/role", authenticateAccessToken, changeUserRole);

// Favorites routes (must be before /:id to avoid conflicts)
router.get("/favorites", authenticateAccessToken, getFavorites);
router.post("/favorites/:bookId", authenticateAccessToken, addFavorite);
router.delete("/favorites/:bookId", authenticateAccessToken, removeFavorite);

router.get("/:id", getUserById);
router.put("/:id", authenticateAccessToken, updateUser);
router.delete("/:id", authenticateAccessToken, unregisterUser);

export default router;
