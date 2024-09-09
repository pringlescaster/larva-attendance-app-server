import { Router } from "express";
import { addStudents, getAllStudents, getStudentById } from "../controllers/studentControllers.js";

const router = Router();

// Route to get all students
router.get('/students', getAllStudents);

// Route to get a specific student by ID
router.get('/students/:id', getStudentById);

// Route to add a new student
router.post('/students', addStudents);

export default router;
