const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://localhost:6379"
});

redisClient.on("connect", () => {
  console.log("Connected to Redis!");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

async function connectRedis() {
  await redisClient.connect();
}

module.exports = { redisClient, connectRedis };
