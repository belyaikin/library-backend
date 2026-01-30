import { HydratedDocument, Schema, Types } from "mongoose";
import mongoose from "mongoose";

export interface User {
  information: UserInformation;
  credentials: UserCredentials;
  ownedBooks: Types.ObjectId[];
}

export interface UserInformation {
  firstName: string;
  lastName: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<User>({
  information: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  credentials: {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  ownedBooks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

export const userModel = mongoose.model("User", userSchema);
