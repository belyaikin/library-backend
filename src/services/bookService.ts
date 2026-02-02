import config from "../config/config.js";
import { bookModel } from "../models/book.js";
import { findAuthorById } from "./authorService.js";

export const findBookById = async (id: string | string[]) => {
  return await bookModel.findById(id);
};

export const createBook = async (
  title: string,
  authorId: string,
  yearPublished: string,
  fileName: string
) => {
  if (findAuthorById(authorId) == null) {
    throw new Error("Author with this ID wasn't found. Maybe create one?");
  }

  const document = new bookModel({
    title,
    author: authorId,
    yearPublished,
    epubUrl: `${config.epubLocation}/${fileName}`
  });

  return await document.save();
};
