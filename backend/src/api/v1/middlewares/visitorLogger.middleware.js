import requestIp from "request-ip";
import geoip from "geoip-lite";

import { TEMP_IP } from "../../../config/env.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const UAParser = require("ua-parser-js");

const getVisitorDetails = (req) => {
  let ip = requestIp.getClientIp(req) || req.ip;
  const ua = req.headers["user-agent"];
  const parser = new UAParser(ua);
  const uaResult = parser.getResult();

  // Handle localhost and temporary IPs
  if (ip === "::1" || ip.startsWith("::ffff:")) {
    ip = TEMP_IP;
  }
  const geo = geoip.lookup(ip) || {};
  return {
    ipAddress: ip,
    userAgent: ua,
    deviceType: uaResult.device?.type || "desktop",
    browser: uaResult.browser?.name || "Unknown",
    os: uaResult.os?.name || "Unknown",
    referer: req.headers["referer"] || "Direct",
    location: {
      country: geo.country || "Unknown",
      city: geo.city || "Unknown",
      region: geo.region || "Unknown",
      latitude: geo.ll[0],
      longitude: geo.ll[1],
    },
    timezone: geo.timezone || "Unknown",
  };
};

export default getVisitorDetails;
