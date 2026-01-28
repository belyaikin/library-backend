import type { Request, Response } from "express";
import { userModel } from "../models/user.js";

// TODO: Move user creation/retrieval logic from here to it's according service

export const getUserById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!id) return response.status(400).json({ message: "ID not provided" });

    const document = await userModel.findById(id);

    if (!document)
      return response.status(404).json({ message: "User not found" });

    return response.status(200).json(document);
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const createUser = async (request: Request, response: Response) => {
  try {
    const { firstName, lastName, email, password } = request.body;

    if (!firstName || !lastName || !email || !password) {
      return response
        .status(400)
        .json({ message: "Not all parameters are specified" });
    }

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

    const savedUser = await document.save();

    return response.status(201).json(savedUser);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
