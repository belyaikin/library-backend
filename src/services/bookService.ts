import mongoose from "mongoose";
import { bookModel } from "../models/book.js";
import { authorExists } from "./authorService.js";
import { deleteEpubFile } from "./epubService.js";

export const findAllBooks = async () => {
  return await bookModel.find({});
};

export const findBookById = async (id: string | string[]) => {
  return await bookModel.findById(id);
};

export const bookExists = async (id: string | string[]) => {
  return await bookModel.exists({_id: id})
}

export const createBook = async (
  title: string,
  authorId: string,
  yearPublished: string,
  fileName: string,
) => {
  if (!authorExists(authorId)) {
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

export const deleteBookById = async (id: string | string[]) => {
  const document = await bookModel.findByIdAndDelete(id);

  if (!document) {
    throw new Error("Book with specified ID wasn't found");
  }

  deleteEpubFile(document.epub);

  return document;
}

export const updateBookById = async (
  id: string | string[],
  title?: string,
  authorId?: string,
  yearPublished?: string | number,
  fileName?: string,
) => {
  const document = await bookModel.findById(id);

  if (!document) {
    throw new Error("Book with specified ID wasn't found");
  }

  if (authorId) {
    const exists = await authorExists(authorId);
    if (!exists) throw new Error("Author with specified ID wasn't found");
    
    document.authorId = new mongoose.Types.ObjectId(authorId)
  }

  if (title !== undefined) document.title = title;

  if (yearPublished !== undefined)
    document.yearPublished = Number(yearPublished);

  if (fileName) {
    deleteEpubFile(document.epub);
    document.epub = fileName;
  }

  return await document.save();
};