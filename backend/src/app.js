import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRouter from "./api/v1/routes/auth.routes.js";
import urlRouter from "./api/v1/routes/url.routes.js";
import errorMiddleware from "./api/v1/middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/urls", urlRouter);

app.use(errorMiddleware);

app.get("/api/v1", (req, res) => {
  res.send("Welcome to the backend server!");
});

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something went wrong!");
// });

export default app;
