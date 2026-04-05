
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// ── Cookie config ─────────────────────────────────────────────
const COOKIE_OPTIONS = {
  httpOnly: true,                                      
  secure: process.env.NODE_ENV === "production",       
   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
  maxAge: 24 * 60 * 60 * 1000,                        
};


const signupValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];


// ── POST /api/auth/signup ─────────────────────────────────────
router.post("/signup", signupValidation, async (req, res) => {
  const errors = validationResult(req);
   if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role: "user" });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Set token as httpOnly cookie — JS cannot access this
    res.cookie("token", token, COOKIE_OPTIONS);

    // ✅ Return non-sensitive user info for the frontend to display
    res.json({
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────
router.post("/logout", (req, res) => {
  // Clear the cookie by setting maxAge to 0
  res.cookie("token", "", { ...COOKIE_OPTIONS, maxAge: 0 });
  res.json({ message: "Logged out successfully" });
});

// ── GET /api/auth/me ──────────────────────────────────────────
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ /me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;







