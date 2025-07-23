import urlModel from "../models/url.model.js";
import { generateShortId } from "../../../utils/generateShortId.js";

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
