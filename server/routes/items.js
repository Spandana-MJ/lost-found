
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const authMiddleware = require("../middleware/auth");
const Item = require("../models/Item");

// 🧩 Cloudinary Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lost-found-items",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

// 📌 Create new item (Upload to Cloudinary)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, description, location, dateLostFound, type, reporterEmail } = req.body;

    const newItem = new Item({
      title,
      description,
      location,
      dateLostFound,
      type,
      reporterEmail,
      reporterId: req.user._id,
      imageUrl: req.file?.path || null, // Cloudinary returns image URL in req.file.path
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ Error creating item:", err);
    res.status(500).json({ message: "Server error while creating item" });
  }
});



// 📌 Get stats for admin dashboard
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const total = await Item.countDocuments();
    const resolved = await Item.countDocuments({ verified: true });
    const pending = await Item.countDocuments({ verified: false });

    res.json({ total, received: resolved, pending });
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ message: "Server error fetching stats" });
  }
});

// 📌 Get verified items (for Admin Dashboard)
router.get("/verified", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Not authorized" });
    const verifiedItems = await Item.find({ verified: true }).sort({ createdAt: -1 });
    res.json(verifiedItems);
  } catch (err) {
    console.error("❌ Error fetching verified items:", err);
    res.status(500).json({ message: "Server error fetching verified items" });
  }
});

// 📌 Get items (User → only their own | Admin → all) — keep this LAST
router.get("/", authMiddleware, async (req, res) => {
  try {
    let items;
    if (req.user.role === "admin") {
      items = await Item.find().sort({ createdAt: -1 });
    } else {
      items = await Item.find({ reporterId: req.user._id }).sort({ createdAt: -1 });
    }
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching items:", err);
    res.status(500).json({ message: "Server error fetching items" });
  }
});


// 📌 Verify item (Admin only)
// router.put("/:id/verify", authMiddleware, async (req, res) => {
  router.put("/:id/verify", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Not authorized" });

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    console.error("❌ Error verifying item:", err);
    res.status(500).json({ message: "Server error verifying item" });
  }
});

// 📌 Delete item (Admin can delete any | User can delete own)
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
    console.error("❌ Error deleting item:", err);
    res.status(500).json({ message: "Server error deleting item" });
  }
});

module.exports = router;




