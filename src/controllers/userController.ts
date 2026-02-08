import type { Request, Response } from "express";
import { createUser, deleteUser, findAllUsers, findUserById, updateUserById, updateUserRole } from "../services/userService.js";
import { Role } from "../models/user.js";

export const getAllUsers = async (request: Request, response: Response) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);

    if (!user || user.role !== Role.Admin) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const users = await findAllUsers();

    const mapped = users.map((u) => ({
      _id: u.id,
      information: u.information,
      credentials: { email: u.credentials.email },
      role: u.role,
      ownedBooks: u.ownedBooks,
    }));

    return response.status(200).json(mapped);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const changeUserRole = async (request: Request, response: Response) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const admin = await findUserById(accessTokenPayload.userId);

    if (!admin || admin.role !== Role.Admin) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const { userId, role } = request.body;

    if (!userId || !role) {
      return response.status(400).json({ message: "userId and role are required" });
    }

    if (!Object.values(Role).includes(role)) {
      return response.status(400).json({ message: "Invalid role" });
    }

    if (userId === accessTokenPayload.userId) {
      return response.status(400).json({ message: "Cannot change your own role" });
    }

    const updated = await updateUserRole(userId, role);

    return response.status(200).json({
      _id: updated.id,
      information: updated.information,
      credentials: { email: updated.credentials.email },
      role: updated.role,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("not found")) {
      return response.status(404).json({ message: msg });
    }
    return response.status(500).json({
      message: "Server error",
      error: msg,
    });
  }
};

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

    const savedUser = await createUser(
      firstName,
      lastName,
      email,
      password,
      role,
    );

    return response.status(201).json(savedUser);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const unregisterUser = async (request: Request, response: Response) => {
  try {
    const accessTokenPayload = request.accessTokenPayload;

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);
    
    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    if (user.role !== Role.Admin || user.id != accessTokenPayload.userId) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const {id} = request.params

    if (!id) {
      return response.status(400).json({message: "ID is not specified"})
    }

    const deletedUser = await deleteUser(id)

    return response.status(201).json(deletedUser);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
}

export const updateUser = async (request: Request, response: Response) => {
  try {
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

    const { id } = request.params
    const { firstName, lastName, email, password, role } = request.body

    if (!id) {
      return response.status(400).json({message: "ID is not specified"})
    }

    if (role && !Object.values(Role).includes(role)) {
      return response.status(400).json({ message: "Invalid role" })
    }

    const updatedUser = await updateUserById(id, firstName, lastName, email, password, role);

    return response.status(201).json({ message: "Successfully updated", updatedUser: updatedUser });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
}