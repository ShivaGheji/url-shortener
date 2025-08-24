import {
  registerUser,
  loginUser,
  logoutUser,
  aboutUser,
  setNewPassword,
} from "../services/auth.servise.js";
import {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
} from "../validators/auth.validator.js";
import { setAuthCookie, clearAuthCookie } from "../../../utils/cookies.js";

export const signUp = async (req, res, next) => {
  try {
    console.dir(req.body);
    const data = registerSchema.parse(req.body);
    const { token, user } = await registerUser(data);
    setAuthCookie(res, token);

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
    const data = loginSchema.parse(req.body);
    const { token, user } = await loginUser(data);
    setAuthCookie(res, token);

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
  try {
    logoutUser(req.user.id);
    clearAuthCookie(res);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await aboutUser(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = updatePasswordSchema.parse(req.body);
    const updatedUser = await setNewPassword(
      req.user.id,
      oldPassword,
      newPassword
    );

    logoutUser(req.user.id);
    clearAuthCookie(res);
    res.status(200).json({
      success: true,
      message: "Password updated successfully, please log in again",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};
