import mongoose, { Schema, Types } from "mongoose";

export interface Comment {
  bookId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  text: string;
  createdAt: Date;
}

const commentSchema = new Schema<Comment>({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.index({ bookId: 1 });

export const commentModel = mongoose.model("Comment", commentSchema);
