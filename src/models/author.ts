import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface Author {
  firstName: string;
  lastName: string;
}

export type authorDocument = HydratedDocument<Author>;

const authorSchema = new Schema<Author>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

export const authorModel = mongoose.model("Author", authorSchema);
