import { Router } from 'express';
import { deleteStudent, getAllStudents, getStudentById, registerStudent, updateStudent } from '../controllers/studentControllers.js';
import { upload } from '../config/multer.js'; // Import multer configuration

const router = Router();

// CREATE OPERATION
router.post('/student/register', upload.single('image'), registerStudent); // Register students with image upload

// READ OPERATION
router.get('/students', getAllStudents); // List all students without authentication check
router.get('/student/:id', getStudentById); // Get a specific student without authentication check

// UPDATE OPERATION
router.put('/student/:id', upload.single('image'), updateStudent); // Update student with image upload

// DELETE OPERATION
router.delete('/student/:id', deleteStudent); // Delete student without authentication check

export default router;
