import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  MONGO_URI,
  BASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  TEMP_IP,
} = process.env;
