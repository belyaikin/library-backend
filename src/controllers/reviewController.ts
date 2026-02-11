import { Request, Response } from "express";
import {
  createReview,
  deleteReview,
  findReviewById,
  findReviewsByBookId,
} from "../services/reviewService.js";
import { findUserById } from "../services/userService.js";

export const getReviewsByBookId = async (
  request: Request,
  response: Response,
) => {
  try {
    const { bookId } = request.params;

    if (!bookId)
      return response.status(400).json({ message: "ID not provided" });

    const document = await findReviewsByBookId(bookId);

    if (!document)
      return response.status(404).json({ message: "Reviews not found" });

    response.status(200).json(document);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const registerReview = async (request: Request, response: Response) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    const { bookId, stars, body } = request.body;

    if (!bookId || !stars) {
      return response
        .status(400)
        .json({ message: "Not all parameters are specified" });
    }

    const savedReview = await createReview(
      accessTokenPayload.userId,
      bookId,
      stars,
      body,
    );

    return response.status(201).json(savedReview);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const unregisterReview = async (
  request: Request,
  response: Response,
) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    const { id } = request.params;

    const review = await findReviewById(id);

    if (!review) {
      return response.status(404).json({ message: "Review wasn't found" });
    }

    if (review.userId.toString() !== user.id) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const deletedReview = await deleteReview(id);

    return response.status(201).json(deletedReview);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
