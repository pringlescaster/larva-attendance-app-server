import { Router } from "express";
import {
  loginTutor,
  getTutorDetails,
  addTutor,
  authStatus,
  logoutTutor,
  updatePw,
} from "../controllers/tutorControllers.js";
import { ensureAuthenticated } from "../utils/authMiddleware.js";

const router = Router();

// // Add Tutor
// router.post('/tutor', addTutor);

// // Check Tutor Auth Status
// router.get('/tutor/status', authenticateToken, authStatus);

// // Tutor Login
// router.post('/tutor/login', loginTutor);

// // Update Tutor
// router.put('/tutor/:id', authenticateToken, updateTutor);

// // Tutor Logout
// router.post('/tutor/logout', authenticateToken, logoutTutor);

// // Get Tutor Details
// router.get('/tutor/details', authenticateToken, getTutorDetails);

//CREATE OPERATION
router.post('/tutor/register', addTutor)
router.post('/tutor/login', loginTutor)
//READ OPERATION
router.get('/tutor/auth/status', ensureAuthenticated, authStatus)
router.get('/tutors', getTutorDetails)
//UPDATE OPERATION

router.put('/tutor/updatepw/:id', updatePw)
// Tutor Logout
router.post('/tutor/logout', ensureAuthenticated, logoutTutor);

export default router;
