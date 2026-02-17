// MUST be the very first line so env vars are available everywhere
require("dotenv").config(); 

const app = require("./app");
const { connectRedis } = require("./config/redis");
const connectDB = require("./config/db");

// Use the environment port, or default to 3000 for local development
const PORT = process.env.PORT || 3000; 

async function startServer() {
  try {
    await connectRedis();   
    await connectDB(); // Ensure DB connects before starting server

    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Kill the server if databases fail to connect
  }
}

startServer();