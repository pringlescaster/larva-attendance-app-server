import { Router } from "express";
import {
  loginTutor,
  getTutorDetails,
  addTutor,
  authStatus,
  logoutTutor,
  updatePw,
  updateTutor,
} from "../controllers/tutorControllers.js";
import { authenticateJWT } from "../utils/authMiddleware.js";

const router = Router();

//CREATE OPERATION
router.post('/tutor/register', addTutor);
router.post('/tutor/login', loginTutor);

//READ OPERATION
router.get('/tutor/auth/status', authenticateJWT, authStatus);
router.get('/tutors', authenticateJWT, getTutorDetails);

//UPDATE OPERATION
router.put('/tutor/password', authenticateJWT, updatePw);
router.put('/tutor/profile', authenticateJWT, updateTutor);

// Tutor Logout
router.post('/tutor/logout', authenticateJWT, logoutTutor);

export default router;
