import { userModel } from "../models/user.js";

export const findUserById = async (id: string | string[]) => {
  return await userModel.findById(id);
};

export const findUserByEmail = async (email: string) => {
  return await userModel.find({ "credentials.email": email });
};

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  const document = new userModel({
    information: {
      firstName,
      lastName,
    },
    credentials: {
      email,
      password,
    },
  });

  return await document.save();
};
