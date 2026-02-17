const { redisClient } = require('../config/redis');

//Variables to define Window size and no of request allowed in that timeframe=>

const WINDOW_SIZE = 60;
const MAX_REQ = 5;

async function RedisRateLimiter(req, res, next) {
  try {
   const userId = req.user.id; 
    const key = `rate-limit:${userId}`
    const currentcount = await redisClient.get(key);

    if (currentcount && parseInt(currentcount) >= MAX_REQ) {
     return res.status(429).json({
        message: "Too Many request at the moment,Please try again Later!",
      });
    }

    if (!currentcount) {
      await redisClient.set(key, 1, { EX: WINDOW_SIZE });
    } else {
      await redisClient.incr(key);
    }
    next();
  } catch (error) {
    console.log("There was an error with redis client");
    next();
  }
}
module.exports = RedisRateLimiter;
