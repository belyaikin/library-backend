import { bookModel } from "../models/book.js";
import { findAuthorById } from "./authorService.js";

// TODO: it's not finished

export const findBookById = async (id: string | string[]) => {
  return await bookModel.findById(id);
};

// TODO
export const createBook = async (title: string, authorId: string, yearPublished: string) => {
  if (!findAuthorById(authorId)) {
    throw new Error("Author with this ID wasn't found. Maybe create one?");
  }

  const document = new bookModel({
    title,
    author: authorId,
    yearPublished
  })

  return await document.save()
};
