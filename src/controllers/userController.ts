import type { Request, Response } from "express";
import { createUser, findUserById } from "../services/userService.js";

export const getUserById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!id) return response.status(400).json({ message: "ID not provided" });

    const document = await findUserById(id);

    if (!document)
      return response.status(404).json({ message: "User not found" });

    return response.status(200).json(document);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const registerUser = async (request: Request, response: Response) => {
  try {
    const { firstName, lastName, email, password, role } = request.body;

    if (!firstName || !lastName || !email || !password) {
      return response
        .status(400)
        .json({ message: "Not all parameters are specified" });
    }

    const savedUser = await createUser(firstName, lastName, email, password, role);

    return response.status(201).json(savedUser);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
