import { Router } from "express";
import { loginTutor, updateTutor, getTutorDetails, addTutor, authStatus, logoutTutor } from "../controllers/tutorControllers.js";
import { headerAuth } from "../utils/headerAuth.js";

const route = Router();

// Add Tutor
route.post('/tutor', addTutor);

// Check Tutor Auth Status
route.get('/tutor/status', headerAuth, authStatus);

// Tutor Login
route.post('/tutor/login', loginTutor);

// Update Tutor
route.put('/tutor/:id', headerAuth, updateTutor);

// Tutor Logout
route.post('/tutor/logout', headerAuth, logoutTutor);

//get tutor
route.get('/tutor/details', headerAuth, getTutorDetails)

export default route;
