import { Request, Response } from "express";
import { createAuthor, findAuthorById } from "../services/authorService.js";
import { Role } from "../models/user.js";
import { findUserById } from "../services/userService.js";

export const getAuthorById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!id) return response.status(400).json({ message: "ID not provided" });

    const document = await findAuthorById(id);

    if (!document)
      return response.status(404).json({ message: "Book not found" });

    response.status(200).json(document);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const registerAuthor = async (request: Request, response: Response) => {
  try {
    const { firstName, lastName } = request.body;

    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    if (user.role !== Role.Admin) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    if (!firstName || !lastName) {
      return response
        .status(400)
        .json({ message: "Not all parameters are specified" });
    }

    const savedAuthor = await createAuthor(firstName, lastName);

    return response.status(201).json(savedAuthor);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
