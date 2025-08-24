import urlModel from "../models/url.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, COOKIE_NAME } from "../../../config/env.js";
import User from "../models/user.model.js";
import getClientMeta from "../../../utils/getClientMeta.js";

export const limitAnonymousUrls = async (req, res, next) => {
  try {
    const token =
      req.cookies[COOKIE_NAME] || req.headers.authorization?.split(" ")[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (user && user.tokenVersion == decoded.tv) {
          req.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            tokenVersion: user.tokenVersion,
          };
          return next();
        }
      } catch (err) {
        next(err);
      }
    }

    // Anonymous logic
    const { ip } = getClientMeta(req);

    const count = await urlModel.countDocuments({
      createdBy: null,
      "clientMeta.ip": ip,
    });

    if (count >= 3) {
      return res.status(403).json({
        success: false,
        message: "Limit reached. Please log in to create more URLs.",
      });
    }

    req.clientMeta = { ip };
    next();
  } catch (err) {
    next(err);
  }
};
