import express from "express";
import {
    addAttendance,
    getAttendanceByStudent,
    getFilteredAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Route to add or update attendance for a student
router.post("/attendance", addAttendance);

// Route to get attendance records for a specific student by their ID
router.get("/attendance/student/:studentId", getAttendanceByStudent);

// Route to get filtered attendance records based on date, course, and cohort
router.get("/attendance", getFilteredAttendance);

export default router;
