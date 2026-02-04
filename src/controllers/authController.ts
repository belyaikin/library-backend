import { Request, Response } from "express";
import { getAccessToken } from "../services/authService.js";

export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response
      .status(400)
      .json({ message: "Email or password is not specified" });
  }

  try {
    const accessToken = await getAccessToken(email, password);
    return response.json({ accessToken: accessToken });
  } catch (error) {
    return response.status(400).json({
      message: error,
    });
  }
};
