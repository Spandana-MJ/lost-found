const express = require("express");
const Item = require("../models/Item");
const sendMail = require("../utils/mailer");
const auth = require("../middleware/auth");

const router = express.Router();

// Get dashboard stats
router.get("/stats", auth, async (req, res) => {
  try {
    const totalReports = await Item.countDocuments();
    const receivedCases = await Item.countDocuments({ status: "verified" });
    const pendingReports = await Item.countDocuments({ status: "pending" });
    res.json({ totalReports, receivedCases, pendingReports });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Manage items
router.get("/items", auth, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).send("Server error");
  }
});




// Send email to reporter manually
router.post("/send-email/:id", auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: "Item not found" });

    await sendMail(
      item.reporterEmail,
      "Update on your lost item",
      `We have updates about your item: ${item.title}. Please contact us for more details.`
    );

    res.json({ msg: "Email sent successfully" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});


// Verify item and send email
router.put("/verify/:id", auth, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "verified" },
      { new: true }
    );

    if (item) {
      await sendMail(
        item.reporterEmail,
        "Your lost item has been found!",
        `We have verified your item: ${item.title}. Please contact us for more details.`
      );
    }

    res.json(item);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;









