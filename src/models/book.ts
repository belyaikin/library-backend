import mongoose, { Schema, Document, Types } from "mongoose";

export interface Book extends Document {
  title: string;
  author: Types.ObjectId;
  yearPublished: number;
}

export interface BookAuthor extends Document {
  firstName: string;
  lastName: string;
}

const bookSchema = new Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "BookAuthor",
  },
});

const bookAuthorSchema = new Schema<BookAuthor>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

export const book = mongoose.model("Book", bookSchema);
export const bookAuthor = mongoose.model("BookAuthor", bookAuthorSchema);
