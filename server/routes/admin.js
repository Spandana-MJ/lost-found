
const express = require("express");
const Item = require("../models/Item");
const sendMail = require("../utils/mailer");
const auth = require("../middleware/auth");

const router = express.Router();

// ── GET /api/admin/stats ──────────────────────────────────────
router.get("/stats", auth, async (req, res) => {
  try {
    const total         = await Item.countDocuments();
    const receivedCases = await Item.countDocuments({ verified: true });
    const pendingReports= await Item.countDocuments({ verified: false });
    res.json({ total, receivedCases, pendingReports });
  } catch (err) {
    console.error("❌ Error fetching admin stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/admin/items ──────────────────────────────────────
router.get("/items", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching admin items:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/admin/send-email/:id ───────────────────────────
router.post("/send-email/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const { subject, message } = req.body;

    if (!message || message.trim().length < 10) {
      return res.status(422).json({ message: "Message is too short" });
    }

    await sendMail(
      item.reporterEmail,
      subject || "Update on your reported item",
      message
    );

    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/admin/verify/:id ─────────────────────────────────

router.put("/verify/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { verified: true }, 
      { new: true }
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    await sendMail(
      item.reporterEmail,
      "Your reported item has been verified!",
      `Great news! Your item "${item.title}" has been verified by our team. Please log in to view the details.`
    );

    res.json(item);
  } catch (err) {
    console.error("❌ Error verifying item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;






