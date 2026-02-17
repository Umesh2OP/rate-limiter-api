const express = require("express");
const cors = require("cors"); // Import CORS
const redisRateLimiter = require('./middleware/redisRateLimiter');
const authRoutes = require('./routes/authroutes');
const auth = require('./middleware/auth');
const usageRoutes = require('./routes/usage');
const app = express();


app.use(cors()); 
app.use(express.json()); 


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});


app.use("/api/auth", authRoutes);

app.get("/api", (req, res) => {
  res.send("API base route working");
});


app.get('/test',auth, redisRateLimiter, (req, res) => {
  res.send(`Request allowed for user: ${req.user.id}`);
});

app.use("/api/usage", auth, usageRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;