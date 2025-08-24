import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET, COOKIE_NAME } from "../../../config/env.js";

export const requireAuth = async (req, res, next) => {
  // const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  const token =
    req.cookies[COOKIE_NAME] || req.headers.authorization?.split(" ")[1];
  if (!token) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || user.tokenVersion !== decoded.tv) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      tokenVersion: user.tokenVersion,
    };
    next();
  } catch (err) {
    next(err);
  }
};
