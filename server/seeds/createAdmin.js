
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); 

(async () => {
  try {
   
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
    const email = process.env.ADMIN_EMAIL;
    const plainPassword = process.env.ADMIN_PASS;
    let existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin already exists. Deleting old one...");
      await User.deleteOne({ email });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 5️⃣ Create admin
    const admin = new User({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin created successfully");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", plainPassword);

    // 6️⃣ Done
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    mongoose.connection.close();
  }
})();


