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
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", mcqRoutes);
app.use("/api", testRoutes);
app.use("/api", adminRoutes);

/*******************************ADMIN STARTED***********************************************/
//Admin Register & Login
app.use("/api", adminAuthRoutes);
//Add Top Level Company  (Ex.ExcelR)  & Granted admin access
app.use("/api", companyRoutes);
//Add University or College under Top Level Company & Granted admin access
app.use("/api", universityRoutes);
//Add Departments under University & Granted admin access
app.use("/api", departmentRoutes);
//Add Years Under Departments & Granted admin access
app.use("/api", yearRoutes);
//Add Sections Under Years  & Granted admin access
app.use("/api", sectionRoutes);
/******************************ADMIN ENDED************************************************/


/******************************STUDENT PORTION STARTED************************************************/
//Student Registration & Login
app.use("/api", studentRoutes);
/******************************STUDENT PORTION ENDED************************************************/






mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.log(err));
