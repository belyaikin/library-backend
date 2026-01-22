import mongoose, { Schema, Document } from "mongoose";

export interface BookInformation extends Document {
  title: string;
  author: BookAuthor;
  yearPublished: number;
}

export interface BookAuthor extends Document {
  firstName: string;
  lastName: string;
}

const bookInformationSchema = new Schema<BookInformation>({
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

export const bookInformation = mongoose.model(
  "BookInformation",
  bookInformationSchema,
);
export const bookAuthor = mongoose.model("BookAuthor", bookAuthorSchema);
