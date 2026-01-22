import type { Request, Response, NextFunction } from "express";
import { userModel, type User } from "../models/user.js";
import type { CallbackError, HydratedDocument } from "mongoose";

export const getUserById = async (
  request: Request,
  response: Response
) => {
  userModel.findById(request.params.id).then((user) => response.send(user));
};

export const createUser = async (
  request: Request,
  response: Response
) => {
  const user = new userModel({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    password: request.body.password
  });

  user
    .save()
    .then((savedUser) => response.status(200).json(savedUser))
    .catch((err) => response.status(400).json({ error: err }));
};
