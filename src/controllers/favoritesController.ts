import { Request, Response } from "express";
import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  findUserById,
} from "../services/userService.js";

export const getFavorites = async (request: Request, response: Response) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const favorites = await getUserFavorites(accessTokenPayload.userId);

    return response.status(200).json({ favorites });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const addFavorite = async (request: Request, response: Response) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const bookId = request.params.bookId as string;

    if (!bookId) {
      return response.status(400).json({ message: "Book ID is not provided" });
    }

    const favorites = await addToFavorites(bookId, accessTokenPayload.userId);

    return response.status(200).json({ favorites });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const removeFavorite = async (request: Request, response: Response) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const bookId = request.params.bookId as string;

    if (!bookId) {
      return response.status(400).json({ message: "Book ID is not provided" });
    }

    const favorites = await removeFromFavorites(
      bookId,
      accessTokenPayload.userId,
    );

    return response.status(200).json({ favorites });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
