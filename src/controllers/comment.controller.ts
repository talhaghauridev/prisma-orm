import prisma from "../db";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHadler from "../utils/asyncHandler";

const createComment = asyncHadler(async (req, res, next) => {
  const { postId, comment, userId } = req.body;

  if (!comment || !userId || !postId) {
    return next(new ApiError(400, "Please fill all fields"));
  }

  const newComment = await prisma.comment.create({
    data: {
      comment,
      postId,
      userId,
    },
  });

  if (!newComment) {
    return next(new ApiError(400, "Comment Created error"));
  }
  res.status(200).json(new ApiResponse(200, {},"Create Comment successfully"));
});

const updateComment = asyncHadler(async (req, res, next) => {
  const { comment } = req.body;
  const id = req.params.id;
  if (!comment || !id) {
    return next(new ApiError(400, "Please fill all fields"));
  }
  const newComment = await prisma.comment.update({
    data: {
      comment,
    },
    where: {
      id: id,
    },
  });

  if (!newComment) {
    return next(new ApiError(500, "Comment update error"));
  }
  res.status(200).json(new ApiResponse(200, {}, "Comment updated successfully"));
});

const deleteComment = asyncHadler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new ApiError(400, "Please provide id"));
  }

  const post = await prisma.comment.delete({
    where: {
      id,
    },
  });
  if (!post) {
    return next(new ApiError(400, "Delete comment error"));
  }
  res.status(200).json(new ApiResponse(200, {},"Delete comment successfullly"));
});

export {createComment,updateComment,deleteComment };
