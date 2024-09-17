import { Router } from "express";
import {
  addStudents,
  getAllStudents,
  getStudentById,
  updateStudentAttendance
} from "../controllers/studentControllers.js";
import { authenticateToken } from "../utils/authMiddleware.js"; // Import authentication middleware

const router = Router();

// Apply authentication middleware to the necessary routes
router.get('/students', authenticateToken, getAllStudents); // Only authenticated tutors can get all students
router.get('/students/:id', authenticateToken, getStudentById); // Only authenticated tutors can get a specific student by ID
router.post('/addstudents', authenticateToken, addStudents); // Only authenticated tutors can add students
router.post('/students/:id/attendance', authenticateToken, updateStudentAttendance); // Only authenticated tutors can update attendance

export default router;
