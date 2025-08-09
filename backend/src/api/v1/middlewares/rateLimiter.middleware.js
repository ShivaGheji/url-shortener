import urlModel from "../models/url.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../config/env.js";
import User from "../models/user.model.js";
import getClientMeta from "../../../utils/getClientMeta.js";

export const limitAnonymousUrls = async (req, res, next) => {
  let token;

  //   console.log("checking headers for token");
  //   console.log(req.headers.authorization);

  const authHeader = req.headers.authorization;

  //   if (
  //     req.headers.authorization &&
  //     req.headers.authorization.startswith("Bearer ")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  const user = await User.findById(decoded.userID);

  if (user) {
    req.user = user;
    return next(); // Authenticated user = skip
  }
  //   const { ip, userAgent } = getClientMeta(req);
  const { ip } = getClientMeta(req);

  const count = await urlModel.countDocuments({
    createdBy: null,
    clientMeta: { ip },
  });

  if (count >= 3) {
    return res
      .status(403)
      .json({ message: "Limit reached. Please log in to create more URLs." });
  }

  req.clientMeta = { ip }; // Pass to controller
  next();
};
