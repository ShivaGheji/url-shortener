import validator from "validator";
import { status } from "http-status";

import { BASE_URL } from "../../../config/env.js";
import { createShortUrlService } from "../services/url.services.js";

export const shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !validator.isURL(originalUrl)) {
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "Invalid URL provided",
    });
  }

  try {
    const shortId = await createShortUrlService(
      originalUrl,
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
        originalUrl,
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
