import { bookAuthorModel, bookModel } from "../models/book.js";

// TODO: it's not finished

export const findBookById = async (id: string | string[]) => {
  return await bookModel.findById(id);
};

export const createAuthor = async (firstName: string, lastName: string) => {
  const document = new bookAuthorModel({
    firstName,
    lastName,
  });

  return await document.save();
};

// TODO
export const createBook = async (name: string, authorId: number) => {
  const authorDocument = bookAuthorModel.findById(authorId);

  if (!authorDocument) {
    throw new Error("Author with this ID wasn't found. Maybe create one?");
  }
};
