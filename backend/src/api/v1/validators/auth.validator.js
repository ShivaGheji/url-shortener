import { z } from "zod";

const nameValidation = z
  .string()
  .min(4, "Name must be at least 4 characters")
  .max(30, "Name must be at most 60 characters");

const passwordValidation = z
  .string()
  .regex(
    /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|;:'",.<>/?]).{8,16}$/,
    "Password must be 8-16 chars, include 1 uppercase & 1 special char"
  );

const emailValidation = z.string().email("Invalid email format");

export const registerSchema = z.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
});

export const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordValidation,
});
