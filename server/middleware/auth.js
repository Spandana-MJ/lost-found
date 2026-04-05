
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  // Read token from Authorization header OR cookie
  const authHeader = req.header("Authorization");
  const token =
    (authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : null) || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both payload shapes:
    //   { user: { id, role } }  ← your current shape
    //   { id, role }            ← flat shape (fallback)
    const userId = decoded.user?.id || decoded.id;
    const userRole = decoded.user?.role || decoded.role;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Fetch full user from DB so req.user always has .role, ._id, .name, .email
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // user._id, user.role, user.name, user.email all available
    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};




