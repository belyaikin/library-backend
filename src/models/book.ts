import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface Book {
  title: string;
  author: Types.ObjectId;
  yearPublished: number;
  epubUrl: string;
}

export type BookDocument = HydratedDocument<Book>;

const bookSchema = new Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
  yearPublished: {
    type: Number,
  },
  epubUrl: {
    type: String,
  },
});

export const bookModel = mongoose.model("Book", bookSchema);
