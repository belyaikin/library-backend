import { bookModel } from "../models/book.js";
import { findAuthorById } from "./authorService.js";

export const findBookById = async (id: string | string[]) => {
  return await bookModel.findById(id);
};

export const createBook = async (
  title: string,
  authorId: string,
  yearPublished: string,
  fileName: string,
) => {
  if (!findAuthorById(authorId)) {
    throw new Error("Author with specified ID wasn't found");
  }

  const document = new bookModel({
    title,
    author: authorId,
    yearPublished,
    epub: fileName,
  });

  return await document.save();
};
