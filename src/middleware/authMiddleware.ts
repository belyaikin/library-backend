import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import config from "../config/config.js";
import { Role } from "../models/user.js";
import { findUserById } from "../services/userService.js";

export interface AccessTokenPayload extends jwt.JwtPayload {
  userId: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      accessTokenPayload?: AccessTokenPayload;
    }
  }
}

const authenticateAccessToken = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response
      .status(401)
      .json({ message: "No authorization header provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return response
      .status(401)
      .json({ message: "No authorization token found" });
  }

  try {
    const payload = jwt.verify(
      token,
      config.access_token_secret,
    ) as AccessTokenPayload;

    if ((await findUserById(payload.userId))?.role != payload.role) {
      throw Error("JWT payload role didn't match with DB stored role");
    }

    request.accessTokenPayload = payload;
    next();
  } catch {
    return response.status(403).json({ message: "Access denied" });
  }
};

export default authenticateAccessToken;
