import { hash } from "bcrypt";
import { Role, userModel } from "../models/user.js";
import { Types } from "mongoose";

export const findUserById = async (id: string | string[]) => {
  return await userModel.findById(id);
};

export const findUserByEmail = async (email: string) => {
  return await userModel
    .findOne({
      "credentials.email": email,
    })
    .select("+credentials.password");
};

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role?: Role,
) => {
  const hashedPassword = await hash(password, 12);

  const document = new userModel({
    information: {
      firstName,
      lastName,
    },
    credentials: {
      email,
      password: hashedPassword,
    },
    role,
  });

  return await document.save();
};

export const addToOwnedBooks = async (bookId: string, userId: string) => {
  return await userModel.findByIdAndUpdate(
    userId,
    { $addToSet: { ownedBooks: new Types.ObjectId(bookId) } },
    { new: true },
  );
};
