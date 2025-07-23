import app from "./app.js";
import { PORT } from "./config/env.js";
import connectToDatabase from "./config/db.config.js";

try {
  await connectToDatabase();
  console.log("Connected to database successfully");

  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("MongoDB connection failed:", error);
}
