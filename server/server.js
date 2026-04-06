
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
// ── Security headers ──────────────────────────────────────────
app.use(helmet());

// ── Request logging ───────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ── Core middleware ───────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Rate limiting on login ────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again in 15 minutes." },
});
app.use("/api/auth/login", loginLimiter);

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",  require("./routes/auth"));
app.use("/api/items", require("./routes/items"));
app.use("/api/admin", require("./routes/admin"));

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", timestamp: new Date() })
);

// ── 404 fallback ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
