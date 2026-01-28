import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface Book {
  title: string;
  author: Types.ObjectId;
  yearPublished: number;
}

export interface BookAuthor {
  firstName: string;
  lastName: string;
}

export interface YearsActive {
  from: Date;
  to: Date;
}

export type BookDocument = HydratedDocument<Book>;
export type BookAuthorDocument = HydratedDocument<BookAuthor>;

const bookSchema = new Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "BookAuthor",
  },
  yearPublished: {
    type: Number,
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

export const bookModel = mongoose.model("Book", bookSchema);
export const bookAuthorModel = mongoose.model("BookAuthor", bookAuthorSchema);
