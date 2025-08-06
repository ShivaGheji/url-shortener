import mongoose from "mongoose";

const clickSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null for anonymous
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: String,
    userAgent: String,
    deviceType: String, // mobile, tablet, desktop
    browser: String,
    os: String,
    referer: String,
    location: {
      country: String,
      city: String,
      region: String,
      latitude: String,
      longitude: String,
    },
    locationResolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Click", clickSchema);
