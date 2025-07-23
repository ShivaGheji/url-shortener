import urlModel from "../models/url.model.js";
import { generateShortId } from "../../../utils/generateShortId.js";
import { status } from "http-status";

export const createShortUrlService = async (originalUrl, userId) => {
  let shortId;
  let existingShortId;

  do {
    shortId = generateShortId();
    existingShortId = await urlModel.findOne({ shortId });
  } while (existingShortId);

  const newUrl = new urlModel({
    originalUrl,
    shortId,
    createdBy: userId || null,
  });

  await newUrl.save();

  return shortId;
};

export const getOriginalUrlService = async (shortId, ip, userAgent) => {
  const urlData = await urlModel.findOne({ shortId });

  if (!urlData) {
    const error = new Error("Short URL not found");
    error.statusCode = status.NOT_FOUND;
    throw error;
  }

  const timestamp = new Date();

  urlData.clicks += 1;
  urlData.visits.push({
    ip,
    userAgent,
    timestamp,
  });
  await urlData.save();

  return urlData.originalUrl;
};
