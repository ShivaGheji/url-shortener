import { registerUser } from "../services/auth.servise.js";

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

export const signIn = (req, res) => {
  res.send("User logged in successfully");
};

export const signOut = (req, res) => {
  res.send("User logged out successfully");
};
