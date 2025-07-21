// import dotenv from "dotenv";
import app from "./app.js";

// dotenv.config();

const PORT = process.env.PORT || 3000;

try {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Error starting the server:", error);
}
