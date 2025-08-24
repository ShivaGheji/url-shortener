import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

import redirectRouter from "./api/v1/routes/redirect.route.js";
import authRouter from "./api/v1/routes/auth.routes.js";
import urlRouter from "./api/v1/routes/url.routes.js";
import errorMiddleware from "./api/v1/middlewares/error.middleware.js";
import {
  ensureCsrfCookie,
  csrfProtect,
} from "./api/v1/middlewares/csrf.middleware.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(compression());
app.use(ensureCsrfCookie);
app.use(csrfProtect);

app.use("/", redirectRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/urls", urlRouter);

app.get("/api/v1", (req, res) => {
  res.send("Welcome to the backend server!");
});

app.use(errorMiddleware);

export default app;
