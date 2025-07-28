// import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../../../config/env.js";

export const registerUser = async ({ name, email, password }) => {
  //   const session = await mongoose.startSession();
  //   session.startTransaction();

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    console.log("new user is - ", newUser);
    //   await newUser.save({ session });
    await newUser.save(); // for local development

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    //   await session.commitTransaction();
    //   session.endSession();

    return {
      user: newUser,
      token,
    };
  } catch (error) {
    //   await session.abortTransaction();
    //   session.endSession();
    throw error;
  } finally {
    //   session.endSession();
  }
};
