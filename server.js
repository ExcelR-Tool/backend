require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const companyRoutes = require("./routes/companyRoutes");
const universityRoutes = require("./routes/universityRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const yearRoutes = require("./routes/yearRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const mcqRoutes = require("./routes/mcqRoutes");
const testRoutes = require("./routes/testRoutes");
const adminRoutes = require("./routes/adminRoutes");
const codeRoutes = require("./routes/codeRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", companyRoutes);
app.use("/api", universityRoutes);
app.use("/api", departmentRoutes);
app.use("/api", yearRoutes);
app.use("/api", sectionRoutes);
app.use("/api", studentRoutes);
app.use("/api", authRoutes);
app.use("/api", mcqRoutes);
app.use("/api", testRoutes);
app.use("/api", adminRoutes);
app.use("/api/code", codeRoutes); // ✅ corrected

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.log("❌ MongoDB connection error:", err));
