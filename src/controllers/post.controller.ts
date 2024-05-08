import prisma from "../db";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHadler from "../utils/asyncHandler";

const allPosts = asyncHadler(async (req, res, next) => {
  const { name, page = 1, limit = 2 } = req.query;

  const query: any = name && {
    where: {
      title: {
        contains: name as string,
        mode: "insensitive",
      },
    },
  };
  const skip = Number((limit as number) * ((page as number) - 1));

  const posts = await prisma.post.findMany({
    ...query,
    include: {
      comments: true,
      author: {
        select: { name: true, email: true },
      },
    },
    skip,
    take: Number(limit),
  });

  res.status(200).json(new ApiResponse(200, posts));
});

const createPost = asyncHadler(async (req, res, next) => {
  const { authorId, content, title } = req.body;

  if (!authorId || !content || !title) {
    return next(new ApiError(400, "Please fill all fields"));
  }

  const post = await prisma.post.create({
    data: {
      title,
      authorId,
      content,
    },
  });

  if (!post) {
    return next(new ApiError(400, "Post Created error"));
  }
  res.status(200).json(new ApiResponse(200, {}, "Create post successfully"));
});

const updatePost = asyncHadler(async (req, res, next) => {
  const { content, title } = req.body;
  const id = req.params.id;
  if (!content || !title) {
    return next(new ApiError(400, "Please fill all fields"));
  }
  const post = await prisma.post.update({
    data: {
      title,
      content,
    },
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    return next(new ApiError(500, "Post update error"));
  }
  res.status(200).json(new ApiResponse(200, {}, "Post updated successfully"));
});

const deletePost = asyncHadler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new ApiError(400, "Please provide id"));
  }

  const post = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });
  if (!post) {
    return next(new ApiError(400, "Delete post error"));
  }
  res.status(200).json(new ApiResponse(200, {}, "Delete post successfullly"));
});

export { allPosts, createPost, updatePost, deletePost };
