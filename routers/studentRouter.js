import { Router } from 'express';
import { deleteStudent, getAllStudents, getStudentById, registerStudent, updateStudent } from '../controllers/studentControllers.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

// CREATE OPERATION
router.post('/student/register',upload.single('image'), registerStudent); // Register students without authentication check

// READ OPERATION
router.get('/students', getAllStudents); // List all students without authentication check
router.get('/student/:id', getStudentById); // Get a specific student without authentication check

// UPDATE OPERATION
router.put('/student/:id', upload.single('image'), updateStudent); // Update student without authentication check

// DELETE OPERATION
router.delete('/student/:id', deleteStudent); // Delete student without authentication check

export default router;

