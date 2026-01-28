import { Request, Response } from "express";
import { findBookById } from "../services/bookService.js";

export const getBookById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!id) return response.status(400).json({ message: "ID not provided" });

    const document = findBookById(id);

    if (!document)
      return response.status(404).json({ message: "Book not found" });

    response.status(200).json(document);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// To create a book, we need to create an author (BookAuthor) first
export const createAuthor = async (request: Request, response: Response) => {};

// This will take a book author ID
export const createBook = async (request: Request, response: Response) => {};
