import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import routers from "./routers/index.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow this origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Ensure OPTIONS is included for preflight requests
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add your routers
app.use('/api/v1', routers);

// Custom 404
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

// Custom 500
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).json({ msg: "Something went wrong", error: err.message });
});

const port = process.env.PORT || 2000;
mongoose.connect(process.env.MONGO_URI, {
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
