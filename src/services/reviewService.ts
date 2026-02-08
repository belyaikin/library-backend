import { reviewModel } from "../models/review.js";

export const findReviewsByBookId = async (bookId: string) => {
  return await reviewModel.find({ bookId }).sort({ createdAt: -1 });
};

export const createReview = async (
  bookId: string,
  userId: string,
  userName: string,
  rating: number,
  text: string,
) => {
  const document = new reviewModel({
    bookId,
    userId,
    userName,
    rating,
    text,
  });

  return await document.save();
};

export const findReviewById = async (id: string) => {
  return await reviewModel.findById(id);
};

export const deleteReviewById = async (id: string) => {
  return await reviewModel.findByIdAndDelete(id);
};

export const countReviewsByUserId = async (userId: string) => {
  return await reviewModel.countDocuments({ userId });
};
