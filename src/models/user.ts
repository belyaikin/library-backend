import { Model, Schema, Document } from "mongoose";

export interface User extends Document {
  firstName: string;
  lastName: string;
  password: string;
}

const userSchema = new Schema<User>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const userModel = new Model("User", userSchema);
