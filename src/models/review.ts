import mongoose, { Schema, Types } from "mongoose";

export interface Review {
  bookId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  rating: number;
  text: string;
  createdAt: Date;
}

const reviewSchema = new Schema<Review>({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
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

reviewSchema.index({ bookId: 1 });
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const reviewModel = mongoose.model("Review", reviewSchema);
