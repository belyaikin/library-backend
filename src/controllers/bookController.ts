import { Request, Response } from "express";
import { createBook, findBookById } from "../services/bookService.js";

export const getBookById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!id) return response.status(400).json({ message: "ID not provided" });

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

    const createdBook = await createBook(title, authorId, yearPublished);

    return response.status(201).json(createdBook);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
