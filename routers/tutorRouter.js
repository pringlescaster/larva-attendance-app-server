import { Router } from "express";
import {
  loginTutor,
  updateTutor,
  getTutorDetails,
  addTutor,
  authStatus,
  logoutTutor,
} from "../controllers/tutorControllers.js";
import { authenticateToken } from "../utils/authMiddleware.js";

const router = Router();

// Add Tutor
router.post('/tutor', addTutor);

// Check Tutor Auth Status
router.get('/tutor/status', authenticateToken, authStatus);

// Tutor Login
router.post('/tutor/login', loginTutor);

// Update Tutor
router.put('/tutor/:id', authenticateToken, updateTutor);

// Tutor Logout
router.post('/tutor/logout', authenticateToken, logoutTutor);

// Get Tutor Details
router.get('/tutor/details', authenticateToken, getTutorDetails);

export default router;
