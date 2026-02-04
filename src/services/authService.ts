import jwt from "jsonwebtoken";

import { findUserByEmail } from "./userService.js";
import config from "../config/config.js";
import { compare } from "bcrypt";

export const getAccessToken = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!(await compare(password, user.credentials.password))) {
    throw new Error("Wrong password");
  }

  const payload = {
    userId: user.id.toString(),
    role: user.role,
  };

  return jwt.sign(payload, config.access_token_secret, {
    expiresIn: "15m",
  });
};
