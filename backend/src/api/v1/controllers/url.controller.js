import { status } from "http-status";

import { BASE_URL } from "../../../config/env.js";
import {
  createShortUrlService,
  getOriginalUrlService,
} from "../services/url.services.js";

export const shortenUrl = async (req, res, next) => {
  try {
    const { shortId, sanitizedUrl } = await createShortUrlService(
      req.body?.originalUrl,
      req.user?._id || null
    );

    return res.status(status.CREATED).json({
      success: true,
      message: "URL shortened successfully",
      data: {
        originalUrl: sanitizedUrl,
        shortUrl: `${BASE_URL}/${shortId}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const redirectToOriginalUrl = async (req, res) => {
  if (!req.params?.shortcode) {
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "Short URL is required",
    });
  }

  try {
    const ip = req.ip || req.headers["x-forwarded-for"];
    const userAgent = req.headers["user-agent"] || null;

    const originalUrl = await getOriginalUrlService(
      req.params.shortcode,
      ip,
      userAgent
    );

    return res.redirect(originalUrl);
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
    });
  }
};
