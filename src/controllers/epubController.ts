import { Request, Response } from "express";
import { findUserById } from "../services/userService.js";
import { findBookById } from "../services/bookService.js";
import { createEpubReadStream } from "../services/epubService.js";

export const getEpub = async (request: Request, response: Response) => {
  const { id } = request.params;
  const accessTokenPayload = request.accessTokenPayload;

  if (!id)
    return response.status(400).json({ message: "Book ID is not provided" });

  if (!accessTokenPayload) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const user = await findUserById(accessTokenPayload.userId);

  if (!user) {
    return response.status(401).json({ message: "User not found" });
  }

  const ownsBook = user.ownedBooks.some((bookId) => bookId.toString() === id);

  if (!ownsBook) {
    return response.status(403).json({ message: "User doesn't own this book" });
  }

  const book = await findBookById(id.toString());

  if (!book) {
    return response.status(404).json({ message: "Book not found" });
  }

  return await createEpubReadStream(book, response);
};
