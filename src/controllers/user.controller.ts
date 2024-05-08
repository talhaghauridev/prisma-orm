import prisma from "../db";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHadler from "../utils/asyncHandler";

const registerUser = asyncHadler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ApiError(400, "Please fill all fields"));
  }
  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser) {
    return next(new ApiError(400, "User is already exist"));
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });

  if (!user) {
    return next(new ApiError(400, "User created error"));
  }
  res.status(200).json(new ApiResponse(200, user));
});

const loginUser = asyncHadler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, "Please fill all fields"));
  }
  const user = await prisma.user.findFirst({ where: { email, password } });

  if (!user) {
    return next(new ApiError(400, "Invalid crententials"));
  }

  res.status(200).json(new ApiResponse(200, user));
});

const updateUser = asyncHadler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const id = req.params.id;
  if (!email || !password || !name) {
    return next(new ApiError(400, "Please fill all fields"));
  }
  const loggedUser = await prisma.user.findFirst({
    where: { id: Number(id) },
  });

  if (!loggedUser) {
    return next(new ApiError(400, "Invalid user"));
  }
  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },

    data: { name, email, password },
  });

  res.status(200).json(new ApiResponse(200, {}, "Update user successfully"));
});

const deleteUser = asyncHadler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new ApiError(400, "Please provide id"));
  }
  const user = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  if (!user) {
    return next(new ApiError(400, "User delete error"));
  }

  res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

const allUsers = asyncHadler(async (req, res, next) => {
  const { name, page = 1, limit = 2 } = req.query;

  const query: any = name && {
    where: {
      name: {
        contains: name as string,
        mode: "insensitive",
      },
    },
  };

  const skip = Number((limit as number) * ((page as number) - 1));
  const users = await prisma.user.findMany({
    ...query,
    skip,
    take:Number(limit),
  });

  res.status(200).json(new ApiResponse(200, users));
});

export { registerUser, loginUser, allUsers, updateUser, deleteUser };
