const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const redisRateLimiter = require("../middleware/redisRateLimiter");
const jwt = require("jsonwebtoken"); // <-- Add this import

router.post("/register", redisRateLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "User registration failed",
    });
  }
});

router.post("/login", redisRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // --- NEW: Generate the JWT ---
    // The payload (first argument) is the non-sensitive data you want to encode
    // The secret (second argument) should ideally be in a .env file
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET || "fallback_secret_for_development", 
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send the token back to the frontend
    res.status(200).json({
      message: "Login successful",
      token: token, // <-- The frontend will save this!
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});



module.exports = router;
