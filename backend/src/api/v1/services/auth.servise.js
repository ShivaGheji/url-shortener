// import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../../../config/env.js";
import { sanitizeUser } from "../../../utils/sanitizeUserInfo.js";

export const registerUser = async ({ name, email, password }) => {
  //   const session = await mongoose.startSession();
  //   session.startTransaction();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ name, email, password: hashedPassword });
  //   await newUser.save({ session });
  await newUser.save(); // for local development

  const token = jwt.sign(
    { userId: newUser._id, tv: newUser.tokenVersion },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

  //   await session.commitTransaction();
  //   session.endSession();

  return {
    user: sanitizeUser(newUser),
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user._id, tv: user.tokenVersion },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const logoutUser = async (userId) => {
  await User.updateOne({ _id: userId }, { $inc: { tokenVersion: 1 } });
};

export const aboutUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return sanitizeUser(user);
};

export const setNewPassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (oldPassword === newPassword) {
    const error = new Error("New password must be different from old password");
    error.statusCode = 400;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    const error = new Error("Old password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const newHashedPassword = await bcrypt.hash(newPassword, salt);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      password: newHashedPassword,
      $inc: { tokenVersion: 1 },
      $currentDate: { updatedAt: true }, // keeps timestamps correct
    },
    { new: true }
  );

  return sanitizeUser(updatedUser);
};
