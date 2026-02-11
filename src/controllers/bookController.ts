import { Request, Response } from "express";
import {
  createBook,
  deleteBookById,
  findAllBooks,
  findBookById,
  updateBookById,
} from "../services/bookService.js";
import { addToOwnedBooks, findUserById, removeFromFavoriteBooks } from "../services/userService.js";
import { Role } from "../models/user.js";

export const getAllBooks = async (request: Request, response: Response) => {
  try {
    return response.status(200).json(await findAllBooks());
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getBookById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    const document = await findBookById(id);

    if (!document)
      return response.status(404).json({ message: "Book not found" });

    return response.status(200).json(document);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const buyBook = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const accessTokenPayload = request.accessTokenPayload;

    if (!id)
      return response.status(400).json({ message: "Book ID is not provided" });

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    const updatedUser = await addToOwnedBooks(id.toString(), user.id);

    return response.status(200).json({
      message: "Successfully bought a book",
      updatedUser: updatedUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const addAsFavorite = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const accessTokenPayload = request.accessTokenPayload;

    if (!id)
      return response.status(400).json({ message: "Book ID is not provided" });

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    const updatedUser = await addToOwnedBooks(id.toString(), user.id);

    return response.status(200).json({
      message: "Successfully added as favorite",
      updatedUser: updatedUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const removeFromFavorites = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const accessTokenPayload = request.accessTokenPayload;

    if (!id)
      return response.status(400).json({ message: "Book ID is not provided" });

    if (!accessTokenPayload) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const user = await findUserById(accessTokenPayload.userId);

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    const updatedUser = await removeFromFavoriteBooks(id.toString(), user.id);

    return response.status(200).json({
      message: "Successfully removed book from favorites",
      updatedUser: updatedUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const registerBook = async (request: Request, response: Response) => {
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

    const { title, authorId, yearPublished } = request.body;

    if (!title || !authorId || !yearPublished) {
      return response
        .status(400)
        .json({ message: "Not all parameters are specified" });
    }

    if (!request.file) {
      return response.status(400).json({ message: "No EPUB file specified" });
    }

    const createdBook = await createBook(
      title,
      authorId,
      yearPublished,
      (request.file as any).key,
    );

    return response.status(201).json(createdBook);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteBook = async (request: Request, response: Response) => {
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

    const { id } = request.params;

    if (!id) {
      return response.status(400).json({ message: "ID is not specified" });
    }

    const deletedBook = deleteBookById(id);

    return response.status(201).json(deletedBook);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateBook = async (request: Request, response: Response) => {
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

    const { id } = request.params;

    if (!id) {
      return response.status(400).json({ message: "ID is not specified" });
    }

    const { title, authorId, yearPublished } = request.body;

    if (!title && !authorId && !yearPublished && !request.file) {
      return response
        .status(400)
        .json({ message: "No update parameters provided" });
    }

    const updated = await updateBookById(
      id,
      title,
      authorId,
      yearPublished,
      request.file ? request.file.filename : undefined,
    );

    return response.status(200).json(updated);
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : error,
    });
  }
};
