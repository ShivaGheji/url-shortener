import { Router } from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const authRouter = Router();

authRouter.post("/sign-up", validate(registerSchema), signUp);

authRouter.post("/sign-in", validate(loginSchema), signIn);

authRouter.post("/sign-out", signOut);

export default authRouter;
