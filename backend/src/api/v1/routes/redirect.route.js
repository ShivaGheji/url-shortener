import { Router } from "express";
import { redirectToOriginalUrl } from "../controllers/url.controller.js";

const redirectRouter = Router();

redirectRouter.get("/:shortcode", redirectToOriginalUrl);

export default redirectRouter;
