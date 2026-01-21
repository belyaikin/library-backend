import type { Request, Response, NextFunction } from 'express';
import type { User } from '../models/user.js';

const getUser = (request: Request, response: Response, next: NextFunction) => {
  // TODO: Get user

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
