import crypto from "crypto";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  NODE_ENV,
} from "../../../config/env.js";

export const ensureCsrfCookie = (req, res, next) => {
  if (!req.cookies[CSRF_COOKIE_NAME]) {
    const token = crypto.randomBytes(24).toString("hex");
    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false,
      sameSite: "Lax",
      secure: NODE_ENV === "production",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
    });
  }
  next();
};

const unsafeMethods = new Set(["POST", "PATCH", "PUT", "DELETE"]);
const csrfSkipPaths = new Set(["/api/v1/auth/sign-in", "/api/v1/auth/sign-up"]);

export const csrfProtect = (req, res, next) => {
  if (!unsafeMethods.has(req.method) || csrfSkipPaths.has(req.path))
    return next();
  const cookieToken = req.cookies[CSRF_COOKIE_NAME];
  const headerToken = (req.headers[CSRF_HEADER_NAME] || "").toString();
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    const error = new Error("CSRF validation failed");
    error.statusCode = 403;
    return next(error);
  }
  next();
};
