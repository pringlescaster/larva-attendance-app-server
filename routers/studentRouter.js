import { Router } from "express";
import {
  addStudents,
  getAllStudents,
  getStudentById,

} from "../controllers/studentControllers.js";
import { ensureAuthenticated } from "../utils/authMiddleware.js"; // Import authentication middleware

const router = Router();

// Apply authentication middleware to the necessary routes
router.get('/students', ensureAuthenticated, getAllStudents); // Only authenticated tutors can get all students
router.get('/students/:id', ensureAuthenticated, getStudentById); // Only authenticated tutors can get a specific student by ID
router.post('/addstudents', ensureAuthenticated, addStudents); // Only authenticated tutors can add students


export default router;
