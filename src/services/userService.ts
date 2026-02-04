import { hash } from "bcrypt";
import { Role, userModel } from "../models/user.js";

export const findUserById = async (id: string | string[]) => {
  return await userModel.findById(id);
};

export const findUserByEmail = async (email: string) => {
  return await userModel.findOne({
    "credentials.email": email,
  }).select("+credentials.password");
};

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role?: Role
) => {
  let hashedPassword = await hash(password, 12)

  const document = new userModel({
    information: {
      firstName,
      lastName,
    },
    credentials: {
      email,
      password: hashedPassword,
    },
    role
  });

  return await document.save();
};
