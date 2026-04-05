
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { body, validationResult } = require("express-validator");
const cloudinary = require("../utils/cloudinary");
const authMiddleware = require("../middleware/auth");
const Item = require("../models/Item");

// ── Cloudinary Storage ────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lost-found-items",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
const upload = multer({ storage });

// ── Validation rules ──────────────────────────────────────────
const itemValidationRules = [
  body("title").trim().notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }).withMessage("Title must be 100 characters or fewer"),
  body("type").isIn(["lost", "found"]).withMessage("Type must be 'lost' or 'found'"),
  body("reporterEmail").trim().notEmpty().withMessage("Reporter email is required")
    .isEmail().withMessage("Must be a valid email").normalizeEmail(),
  body("description").optional().isLength({ max: 500 }),
  body("location").optional().trim().isLength({ max: 200 }),
];

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
    return false;
  }
  return true;
};

// ── GET /api/items/public — No auth required ──────────────────
// ✅ Shows UNVERIFIED lost items = items that are STILL LOST
// Once admin verifies (marks as found), item disappears from here
router.get("/public", async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 12);
    const skip  = (page - 1) * limit;

    const search = req.query.search?.trim();

    const filter = {
      verified: false, // ✅ CHANGED: false = still lost, not yet found by admin
       type: "lost",    // ✅ only lost items make sense to browse publicly
      ...(search && {
        $or: [
          { title:       { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location:    { $regex: search, $options: "i" } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      Item.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("title description location dateLostFound type imageUrl createdAt reporterEmail"),
      Item.countDocuments(filter),
    ]);

    res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("❌ Error fetching public items:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/items/stats ──────────────────────────────────────
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    const total    = await Item.countDocuments();
    const resolved = await Item.countDocuments({ verified: true });  // found by admin
    const pending  = await Item.countDocuments({ verified: false }); // still lost
    res.json({ total, received: resolved, pending });
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ message: "Server error fetching stats" });
  }
});

// ── GET /api/items/verified ───────────────────────────────────
router.get("/verified", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    const verifiedItems = await Item.find({ verified: true }).sort({ createdAt: -1 });
    res.json(verifiedItems);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/items — Paginated ────────────────────────────────
router.get("/", authMiddleware, async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const filter = req.user.role === "admin" ? {} : { reporterId: req.user._id };

    const [items, total] = await Promise.all([
      Item.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Item.countDocuments(filter),
    ]);

    res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/items — Create item ─────────────────────────────
router.post("/", authMiddleware, upload.single("image"), itemValidationRules, async (req, res) => {
  if (!validate(req, res)) return;
  try {
    const { title, description, location, dateLostFound, type, reporterEmail } = req.body;
    const newItem = new Item({
      title, description, location,
      dateLostFound: dateLostFound || undefined,
      type, reporterEmail,
      reporterId: req.user._id,
      imageUrl: req.file?.path || null,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ Error creating item:", err);
    res.status(500).json({ message: "Server error while creating item" });
  }
});

// ── PUT /api/items/:id/verify — Admin marks item as FOUND ─────
router.put("/:id/verify", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { verified: true }, // verified: true = item has been found by admin
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/items/:id ─────────────────────────────────────
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (req.user.role !== "admin" && item.reporterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
