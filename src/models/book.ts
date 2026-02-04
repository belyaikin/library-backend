import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface Book {
  title: string;
  authorId: Types.ObjectId;
  yearPublished: number;
  epub: string;
}

const bookSchema = new Schema<Book>({
  title: {
    type: String,
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
  yearPublished: {
    type: Number,
  },
  epub: {
    type: String,
  },
});

export const bookModel = mongoose.model("Book", bookSchema);
