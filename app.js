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
app.use(cors({
  origin: process.env.CLIENT_DOMAIN,
  methods: 'GET, PUT, PATCH, POST, DELETE, HEAD',
  credentials: true, //Allow credentials (cookies, authorization headers)
  headers: ['Content-Type, Authorization']
}))
// Add your routers

app.use('/api/v1', routers)

//Custom 404
app.use((req,res) => {
  res.status(404)
  res.send('404 - Not Found')
})


//Custom 500
app.use((err,req,res,next) => {
  console.log(err.message)
  res.status(500)
  res.json({ msg: "Something went wrong", error: err.message })
  next()
})


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
