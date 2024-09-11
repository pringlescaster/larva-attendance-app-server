//first thing first when starting your server side is to "npm init -y"

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import tutorRouter from "./routers/tutorRouter.js";
import studentRouter from "./routers/studentRouter.js";
import adminRouter from "./routers/adminRouter.js";
import attendanceRouter from "./routers/attendanceRouter.js"


const app = express();
dotenv.config();
app.use(express.json());
app.use(cors())


app.use(tutorRouter)
app.use(studentRouter)
app.use(adminRouter)
app.use(attendanceRouter)


const port = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.log(error.message);
  });
