import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import tutorRouter from "./routers/tutorRouter.js";
import studentRouter from "./routers/studentRouter.js"; // Import updated studentRouter
import adminRouter from "./routers/adminRouter.js";
import attendanceRouter from "./routers/attendanceRouter.js";
import { authenticateToken } from './utils/authMiddleware.js'; // Import the authenticateToken middleware

const app = express();
dotenv.config();

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:3000',
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions)); // Apply CORS options
app.use(cookieParser());

// Add your routers
app.use(tutorRouter);
app.use(studentRouter); // Use updated studentRouter
app.use(adminRouter);
app.use(attendanceRouter);

// Define a protected route (example)
app.use('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: "This is a protected route." });
});

const port = process.env.PORT || 2000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.log("Database connection error:", error.message);
  });
