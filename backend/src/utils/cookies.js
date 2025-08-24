import { COOKIE_NAME, NODE_ENV } from "../config/env.js";

export const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: computeMaxAgeFromJwt(),
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
  });
};

export const computeMaxAgeFromJwt = () => {
  // Fallback: 30 minutes
  return 30 * 60 * 1000;
};
