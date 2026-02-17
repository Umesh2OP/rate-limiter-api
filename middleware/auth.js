const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // CHANGE THIS LINE: 
    // Your token has 'userId', so we map it to 'id' for your other routes to use.
    req.user = {
      id: decoded.userId || decoded.id 
    };
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};