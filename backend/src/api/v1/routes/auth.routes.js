import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  me,
  changePassword,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", requireAuth, signOut);
authRouter.get("/me", requireAuth, me);
authRouter.post("/me/password", requireAuth, changePassword);

export default authRouter;
