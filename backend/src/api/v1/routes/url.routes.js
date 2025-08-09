import { Router } from "express";
import { shortenUrl } from "../controllers/url.controller.js";
import { limitAnonymousUrls } from "../middlewares/rateLimiter.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { migrateAnonymousUrls } from "../services/url.services.js";

const urlRouter = Router();

urlRouter.get("/", (req, res) => {
  res.send("URL routes are working!");
});

urlRouter.post("/shorten", limitAnonymousUrls, shortenUrl);
urlRouter.post("/migrate", protect, migrateAnonymousUrls);

urlRouter.get("/custom", (req, res) => {
  res.send("Custom short URL created successfully");
});

urlRouter.put("/:shortUrl", (req, res) => {
  res.send("Short URL updated successfully");
});

urlRouter.delete("/:shortUrl", (req, res) => {
  res.send("Short URl deleted successfully");
});

urlRouter.get("/:shortUrl/stats", (req, res) => {
  res.send("Short URL statistics");
});

export default urlRouter;
