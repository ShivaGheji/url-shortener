import urlModel from "../models/url.model.js";
import { generateShortId } from "../../../utils/generateShortId.js";
import { sanitizeUrl } from "../../../utils/urlValidation.js";

export const createShortUrlService = async (
  originalUrl,
  userId,
  clientMeta
) => {
  // check original url exists or not
  if (!originalUrl) {
    const error = new Error("Original URL is required");
    error.statusCode = 400;
    throw error;
  }

  // Check valid URL
  const sanitizedUrl = sanitizeUrl(originalUrl);

  if (!sanitizedUrl) {
    const error = new Error("Invalid URL format");
    error.statusCode = 400;
    throw error;
  }

  let shortId;
  let existingShortId;

  // if short id exists then regenerate new short id
  do {
    shortId = generateShortId();
    existingShortId = await urlModel.findOne({ shortId });
  } while (existingShortId);

  const newUrl = new urlModel({
    originalUrl,
    shortId,
    createdBy: userId || null,
    clientMeta,
  });

  await newUrl.save();

  return { shortId, sanitizedUrl };
};

export const getOriginalUrlService = async (shortId) => {
  if (!shortId) {
    const error = new Error("Short URL is required");
    error.statusCode = 400;
    throw error;
  }

  const urlData = await urlModel.findOne({ shortId });

  if (!urlData) {
    const error = new Error("Short URL not found");
    error.statusCode = 400;
    throw error;
  }

  urlData.clickCount += 1;
  await urlData.save();

  return {
    urlId: urlData._id,
    originalUrl: urlData.originalUrl,
    // createdBy: urlData.createdBy || "Unknown",
    createdBy: urlData.createdBy,
  };
};
