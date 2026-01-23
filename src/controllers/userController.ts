import type { Request, Response } from "express";
import { userModel } from "../models/user.js";

export const getUserById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!id) response.status(400).json({ message: "ID not provided" });

    const document = userModel.findById(id);

    if (!document) response.status(404).json({ message: "User not found" });

    response.status(200).json(document);
  } catch (error) {
    response
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const createUser = async (request: Request, response: Response) => {
  const { firstName, lastName, email, password } = request.body;

  if (!firstName || !lastName || !password || !email)
    response.status(400).json({ message: "Not all parameters are specified" });

  const user = new userModel({
    firstName,
    lastName,
    email,
    password,
  });

  user
    .save()
    .then((savedUser) => response.status(200).json(savedUser))
    .catch((err) => response.status(500).json({ error: err }));
};
