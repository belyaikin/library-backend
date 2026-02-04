import { Request, Response } from "express";
import { createBook, findBookById } from "../services/bookService.js";
import { findUserById } from "../services/userService.js";
import { Role } from "../models/user.js";

export const getBookById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const accessTokenPayload = request.accessTokenPayload;

    if (!id) return response.status(400).json({ message: "ID not provided" });

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    const ownsBook = user.ownedBooks.some((bookId) => bookId.toString() === id);

    if (!ownsBook) {
      return response
        .status(403)
        .json({ message: "User doesn't own this book" });
    }

    const document = await findBookById(id);

    if (!document)
      return response.status(404).json({ message: "Book not found" });

    return response.status(200).json(document);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const registerBook = async (request: Request, response: Response) => {
  try {
    const { title, authorId, yearPublished } = request.body;

    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    if (user.role !== Role.Admin) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !authorId || !yearPublished) {
      return response
        .status(400)
        .json({ message: "Not all parameters are specified" });
    }

    if (!request.file) {
      return response.status(400).json({ message: "No EPUB file specified" });
    }

    const createdBook = await createBook(
      title,
      authorId,
      yearPublished,
      request.file.filename,
    );

    return response.status(201).json(createdBook);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
