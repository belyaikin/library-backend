import type { Request, Response, NextFunction } from "express";
import { userModel, type User } from "../models/user.js";
import type { CallbackError, HydratedDocument } from "mongoose";

const getUserById = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const id = request.params.id;

  await userModel.findById(
    id,
    (err: CallbackError, foundUser: HydratedDocument<User>) => {
      if (err) {
        response.status(500).send("User not found");
      } else {
        response.status(200).json(foundUser);
      }
    },
  );

  next();
};

const createUser = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // TODO: Create user

  next();
};
