import { commentModel } from "../models/comment.js";

export const findCommentsByBookId = async (bookId: string) => {
  return await commentModel.find({ bookId }).sort({ createdAt: -1 });
};

export const createComment = async (
  bookId: string,
  userId: string,
  userName: string,
  text: string,
) => {
  const document = new commentModel({
    bookId,
    userId,
    userName,
    text,
  });

  return await document.save();
};

export const findCommentById = async (id: string) => {
  return await commentModel.findById(id);
};

export const deleteCommentById = async (id: string) => {
  return await commentModel.findByIdAndDelete(id);
};

export const countCommentsByUserId = async (userId: string) => {
  return await commentModel.countDocuments({ userId });
};
