import { status } from "http-status";

import { BASE_URL } from "../../../config/env.js";
import {
  createShortUrlService,
  getOriginalUrlService,
} from "../services/url.services.js";
import getVisitorDetails from "../middlewares/visitorLogger.middleware.js";

// temp -  later move this
import visitModel from "../models/visit.model.js";

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

export const redirectToOriginalUrl = async (req, res, next) => {
  try {
    const { urlId, originalUrl, createdBy } = await getOriginalUrlService(
      req.params?.shortcode
    );

    const visitor = getVisitorDetails(req);

    const visitData = new visitModel({
      urlId,
      userId: createdBy,
      ...visitor,
    });

    await visitData.save();

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.redirect(302, originalUrl);
  } catch (error) {
    next(error);
  }
};
