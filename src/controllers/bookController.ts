import { Request, Response } from "express";
import { bookModel } from "../models/book";

// TODO: Move book creation/retrieval logic from here to it's according service

export const getBookById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!id) return response.status(400).json({ message: "ID not provided" });

    const document = await bookModel.findById(id);

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
