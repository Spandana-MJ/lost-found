// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const cors = require("cors");
// const path = require("path");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/items", require("./routes/items"));
// app.use("/api/admin", require("./routes/admin"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/items", require("./routes/items"));
app.use("/api/admin", require("./routes/admin"));

// Serve React frontend

if (process.env.NODE_ENV === 'production') {
  const __dirnameRoot = path.resolve(__dirname, '..'); // go up one folder
  app.use(express.static(path.join(__dirnameRoot, 'client', 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirnameRoot, 'client', 'dist', 'index.html'));
  });
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


