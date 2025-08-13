
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    location: String,
    dateLostFound: Date,
    type: { type: String, enum: ["lost", "found"], default: "lost" },
    reporterEmail: String,
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    imageUrl: String,
    verified: { type: Boolean, default: false } // ✅ new field for admin verification
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);














