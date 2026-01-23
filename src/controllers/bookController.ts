import { Request, Response } from "express";
import { book } from "../models/book";

export const getBookById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!id) response.status(400).json({ message: "ID not provided" });

    const document = await book.findById(id);

    if (!document) response.status(404).json({ message: "Book not found" });

    response.status(200).json(document);
  } catch (error) {
    response
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
