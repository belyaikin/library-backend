import { reviewModel } from "../models/review.js";

export const findReviewsByBookId = async (bookId: string | string[]) => {
  return await reviewModel.find({ bookId: bookId });
};

export const findReviewById = async (id: string | string[]) => {
  return await reviewModel.findById(id);
};

export const createReview = async (
  userId: string | string[],
  bookId: string | string[],
  stars: number,
  body: string,
) => {
  const document = new reviewModel({
    userId,
    bookId,
    stars,
    body,
  });

  return await document.save();
};

export const deleteReview = async (id: string | string[]) => {
  return await reviewModel.findByIdAndDelete(id);
};
