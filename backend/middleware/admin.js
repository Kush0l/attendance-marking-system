const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");

function adminMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
    req.userId = decoded.id; // Attach user ID to request
    next(); // Proceed to next middleware
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
}

module.exports = { adminMiddleware };
