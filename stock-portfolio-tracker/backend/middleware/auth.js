const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: "No authorization token provided" 
      });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ 
        error: "Invalid authorization format" 
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined!");
      return res.status(500).json({ 
        error: "Server configuration error" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        error: "Token has expired, please login again" 
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        error: "Invalid token" 
      });
    }
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ 
      error: "Authorization failed" 
    });
  }
};

module.exports = authMiddleware;
