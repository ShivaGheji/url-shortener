import { Router } from "express";

const urlRouter = Router();

urlRouter.get("/", (req, res) => {
  res.send("URL routes are working!");
});

urlRouter.post("/shorten", (req, res) => {
  res.send("Shortened URL");
});

urlRouter.get("/custom", (req, res) => {
  res.send("Custom short URL created successfully");
});

urlRouter.get("/:shortUrl", (req, res) => {
  res.send(": shortURL route");
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
