import { Request, Response } from "express";
import { createAuthor, findAuthorById } from "../services/authorService.js";

export const getAuthorById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!id) return response.status(400).json({ message: "ID not provided" });

    const document = findAuthorById(id);

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

export const registerAuthor = async (request: Request, response: Response) => {
  try {
    const { firstName, lastName } = request.body;

    if (!firstName || !lastName) {
      return response
        .status(400)
        .json({ message: "Not all parameters are specified" });
    }

    const savedAuthor = createAuthor(firstName, lastName);

    return response.status(201).json(savedAuthor);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
