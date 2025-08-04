import { registerUser, checkUser } from "../services/auth.servise.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res, next) => {
  try {
    const { token, user } = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { token, user },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { token, user } = await checkUser(req.body);

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res) => {
  res.send("User logged out successfully");
};
