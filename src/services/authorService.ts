import { authorModel } from "../models/author.js";

export const findAuthorById = async (id: string | string[]) => {
  return await authorModel.findById(id);
};

export const createAuthor = async (firstName: string, lastName: string) => {
  const document = new authorModel({
    firstName,
    lastName,
  });

  return await document.save();
};
