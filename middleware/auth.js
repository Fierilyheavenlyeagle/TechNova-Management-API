
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ========================================
// JWT AUTHENTICATION MIDDLEWARE
// ========================================

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verify Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. JWT token required.",
    });
  }

  // 2. Extract JWT token
  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token not provided.",
    });
  }

  // 3. Verify server JWT configuration
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Authentication is not configured.",
    });
  }

  // 4. Validate JWT token
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      }
    );

    // Save authenticated user information
    req.user = decoded;

    // Allow request to continue
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired JWT token.",
    });
  }
};
