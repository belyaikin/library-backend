import { hash } from "bcrypt";
import { Role, userModel } from "../models/user.js";
import { Types } from "mongoose";

export const findAllUsers = async () => {
  return await userModel.find({});
};

export const findUserById = async (id: string | string[]) => {
  return await userModel.findById(id);
};

export const updateUserRole = async (userId: string, newRole: Role) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");
  user.role = newRole;
  return await user.save();
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

export const updateUserById = async (
  id: string | string[],
  
  firstName?: string,
  lastName?: string,
  email?: string,
  password?: string,
  role?: Role,
) => {
  const user = await userModel.findById(id);

  if (!user) {
    throw new Error(`User with ID ${id} wasn't found.`)
  }

  if (firstName) user.information.firstName = firstName;
  if (lastName) user.information.lastName = lastName;

  if (email) user.credentials.email = email;
  if (password) user.credentials.password = password;

  if (role) user.role = role;

  return await user.save();
}

export const deleteUser = async (id: string | string[]) => {
  return await userModel.findByIdAndDelete(id)
};

export const addToOwnedBooks = async (bookId: string, userId: string) => {
  return await userModel.findByIdAndUpdate(
    userId,
    { $addToSet: { ownedBooks: new Types.ObjectId(bookId) } },
    { new: true },
  );
};

export const getUserFavorites = async (userId: string) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error("User not found");
  return user.favorites.map((id) => id.toString());
};

export const addToFavorites = async (bookId: string, userId: string) => {
  const user = await userModel.findByIdAndUpdate(
    userId,
    { $addToSet: { favorites: new Types.ObjectId(bookId) } },
    { new: true },
  );
  if (!user) throw new Error("User not found");
  return user.favorites.map((id) => id.toString());
};

export const removeFromFavorites = async (bookId: string, userId: string) => {
  const user = await userModel.findByIdAndUpdate(
    userId,
    { $pull: { favorites: new Types.ObjectId(bookId) } },
    { new: true },
  );
  if (!user) throw new Error("User not found");
  return user.favorites.map((id) => id.toString());
};
