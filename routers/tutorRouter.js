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
import { upload } from "../config/multer.js";
import { authenticateJWT } from "../utils/authMiddleware.js";

const router = Router();

// CREATE OPERATION
router.post('/tutor/register', upload.single('image'), addTutor);
router.post('/tutor/login', loginTutor);

// READ OPERATION
router.get('/tutor/auth/status', authenticateJWT, authStatus);
router.get('/tutor/profile', authenticateJWT, getTutorDetails); // Unified route for getting tutor details

// UPDATE OPERATION
router.put('/tutor/password', authenticateJWT, updatePw);
router.put('/tutor/profile', upload.single('image'), authenticateJWT, updateTutor);

// Tutor Logout
router.post('/tutor/logout', authenticateJWT, logoutTutor);

export default router;
