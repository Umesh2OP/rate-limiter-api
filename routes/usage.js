const express = require("express");
const router = express.Router();
const { redisClient } = require("../config/redis");

router.get("/my-stats", async (req, res) => {
  try {
    const userid = req.user.id;
    const key = `rate-limit:${userid}`;
    const currentusage = await redisClient.get(key);
    const ttL = await redisClient.ttl(key);

    const Limit = 100;
    const used = currentusage ? parseInt(currentusage) : 0;

    res.json({
      success: true,
      data: {
        used: used,
        limit: Limit,
        remaining: Math.max(0, Limit - used),
        resetInSeconds: ttL > 0 ? ttL : 0,
      },
    });
  } catch (error) {
    console.error("Usage Route Error:", error);
    res.status(500).json({ success: false, message: "Server error fetching stats" });
  
  }
});

module.exports=router;
