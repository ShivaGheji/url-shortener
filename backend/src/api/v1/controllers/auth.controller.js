import { registerUser } from "../services/auth.servise.js";
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

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = createToken(user._id);
  res.cookie("token", token, { httpOnly: true, secure: true });
  res.json({ message: "Logged in", userId: user._id });
};

export const signOut = (req, res) => {
  res.send("User logged out successfully");
};
