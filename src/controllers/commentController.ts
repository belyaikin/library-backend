import { Request, Response } from "express";
import {
  createComment,
  deleteCommentById,
  findCommentById,
  findCommentsByBookId,
} from "../services/commentService.js";
import { findUserById } from "../services/userService.js";
import { Role } from "../models/user.js";

export const getCommentsByBook = async (
  request: Request,
  response: Response,
) => {
  try {
    const bookId = request.params.bookId as string;

    if (!bookId) {
      return response
        .status(400)
        .json({ message: "Book ID is not provided" });
    }

    const comments = await findCommentsByBookId(bookId);

    const mapped = comments.map((c) => ({
      id: c.id,
      bookId: c.bookId,
      userId: c.userId,
      userName: c.userName,
      text: c.text,
      createdAt: c.createdAt.toISOString(),
    }));

    return response.status(200).json(mapped);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const addComment = async (request: Request, response: Response) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    const { bookId, text } = request.body;

    if (!bookId || !text) {
      return response
        .status(400)
        .json({ message: "bookId and text are required" });
    }

    const userName = `${user.information.firstName} ${user.information.lastName}`;

    const comment = await createComment(
      bookId,
      accessTokenPayload.userId,
      userName,
      text,
    );

    return response.status(201).json({
      id: comment.id,
      bookId: comment.bookId,
      userId: comment.userId,
      userName: comment.userName,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const removeComment = async (request: Request, response: Response) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const id = request.params.id as string;

    if (!id) {
      return response
        .status(400)
        .json({ message: "Comment ID is not provided" });
    }

    const comment = await findCommentById(id);

    if (!comment) {
      return response.status(404).json({ message: "Comment not found" });
    }

    const isOwner = comment.userId.toString() === accessTokenPayload.userId;
    const isAdmin = accessTokenPayload.role === Role.Admin;

    if (!isOwner && !isAdmin) {
      return response.status(403).json({ message: "Access denied" });
    }

    await deleteCommentById(id);

    return response.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
