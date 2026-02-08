import { Request, Response } from "express";
import {
  countReviewsByUserId,
  createReview,
  deleteReviewById,
  findReviewById,
  findReviewsByBookId,
} from "../services/reviewService.js";
import { findUserById } from "../services/userService.js";
import { Role } from "../models/user.js";

export const getReviewsByBook = async (
  request: Request,
  response: Response,
) => {
  try {
    const bookId = request.params.bookId as string;

    if (!bookId) {
      return response.status(400).json({ message: "Book ID is not provided" });
    }

    const reviews = await findReviewsByBookId(bookId);

    const mapped = reviews.map((r) => ({
      id: r.id,
      bookId: r.bookId,
      userId: r.userId,
      userName: r.userName,
      rating: r.rating,
      text: r.text,
      createdAt: r.createdAt.toISOString(),
    }));

    return response.status(200).json(mapped);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const addReview = async (request: Request, response: Response) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    const { bookId, rating, text } = request.body;

    if (!bookId || !rating || !text) {
      return response
        .status(400)
        .json({ message: "bookId, rating and text are required" });
    }

    if (rating < 1 || rating > 5) {
      return response
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const userName = `${user.information.firstName} ${user.information.lastName}`;

    const review = await createReview(
      bookId,
      accessTokenPayload.userId,
      userName,
      rating,
      text,
    );

    return response.status(201).json({
      id: review.id,
      bookId: review.bookId,
      userId: review.userId,
      userName: review.userName,
      rating: review.rating,
      text: review.text,
      createdAt: review.createdAt.toISOString(),
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return response
        .status(409)
        .json({ message: "You have already reviewed this book" });
    }
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getUserReviewCount = async (
  request: Request,
  response: Response,
) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const count = await countReviewsByUserId(accessTokenPayload.userId);

    return response.status(200).json({ count });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const removeReview = async (request: Request, response: Response) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const id = request.params.id as string;

    if (!id) {
      return response.status(400).json({ message: "Review ID is not provided" });
    }

    const review = await findReviewById(id);

    if (!review) {
      return response.status(404).json({ message: "Review not found" });
    }

    const isOwner = review.userId.toString() === accessTokenPayload.userId;
    const isAdmin = accessTokenPayload.role === Role.Admin;

    if (!isOwner && !isAdmin) {
      return response.status(403).json({ message: "Access denied" });
    }

    await deleteReviewById(id);

    return response.status(200).json({ message: "Review deleted" });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
