import validator from "validator";
import { URL } from "url";
import { status } from "http-status";

function normalizeUrl(url) {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

function isBlockedDomain(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;

    const blocked = ["localhost", "127.0.0.1", "0.0.0.0"];
    const ipPattern = /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[0-1])\./;

    if (blocked.includes(hostname) || ipPattern.test(hostname)) {
      return true;
    }

    return false;
  } catch (err) {
    return true;
  }
}

export const sanitizeUrl = (inputUrl) => {
  const normalized = normalizeUrl(inputUrl);

  const isSafe = validator.isURL(normalized, {
    protocols: ["http", "https"],
    require_protocol: true,
    allow_underscores: false,
    host_whitelist: false,
  });

  if (!isSafe) {
    const error = new Error("Invalid or unsupported URL");
    error.statusCode = status.BAD_REQUEST;
    throw error;
  }

  if (isBlockedDomain(normalized)) {
    const error = new Error("Blocked or private domain");
    error.statusCode = status.FORBIDDEN;
    throw error;
  }

  return normalized;
};
