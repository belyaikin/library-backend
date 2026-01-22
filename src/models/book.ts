import mongoose, { Model, Schema, Document } from "mongoose";

export interface Book extends Document {
  title: string;
  author: {
    firstName: string;
    lastName: string;
  };
  content: string;
}

const bookSchema = new Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  author: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  content: {
    type: String,
    required: true,
  },
});

export const book = mongoose.model("Book", bookSchema);
