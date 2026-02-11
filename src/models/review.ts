import mongoose, { Schema, Types } from "mongoose";

interface Review {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  stars: number;
  body: string;
}

const reviewSchema = new Schema<Review>({
  userId: { type: Schema.Types.ObjectId, required: true },
  bookId: { type: Schema.Types.ObjectId, required: true },
  stars: { type: Number, required: true },
  body: { type: String },
});

export const reviewModel = mongoose.model("Review", reviewSchema);
