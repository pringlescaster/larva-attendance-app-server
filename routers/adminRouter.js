import { Router } from "express";
import { createAdmin, getAdminDetails, loginAdmin, logoutAdmin } from "../controllers/adminController.js";
import { authenticateToken } from "../utils/authenticateToken.js";
import { authStatus } from "../controllers/tutorControllers.js";


const route = Router()
route.post('/admin', createAdmin);
route.post('/admin/login', loginAdmin);
route.get('/admin/status', authenticateToken, authStatus)
route.post('/admin/logout',authenticateToken,logoutAdmin)
route.get('/admin/details', authenticateToken, getAdminDetails);



export default route