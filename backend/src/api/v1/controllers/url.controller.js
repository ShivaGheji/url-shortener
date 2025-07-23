import validator from "validator";
import { status } from "http-status";
import { sanitizeUrl } from "../../../utils/urlValidation.js";

import { BASE_URL } from "../../../config/env.js";
import {
  createShortUrlService,
  getOriginalUrlService,
} from "../services/url.services.js";

export const shortenUrl = async (req, res) => {
  if (!req.body?.originalUrl) {
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "Original URL is required",
    });
  }

  const { originalUrl } = req.body;

  const sanitizedUrl = sanitizeUrl(originalUrl);
  if (!sanitizedUrl) {
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "Invalid URL format",
    });
  }

  try {
    const shortId = await createShortUrlService(
      sanitizeUrl,
      req.user ? req.user._id : null
    );

    if (!shortId) {
      return res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create short URL",
      });
    }

    return res.status(status.CREATED).json({
      success: true,
      message: "URL shortened successfully",
      data: {
        originalUrl: sanitizedUrl,
        shortUrl: `${BASE_URL}/${shortId}`,
      },
    });
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
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
