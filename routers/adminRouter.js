import { Router } from "express";
import { createAdmin, getAdminDetails, loginAdmin, logoutAdmin } from "../controllers/adminController.js";
import { headerAuth } from "../utils/headerAuth.js";
import { authStatus } from "../controllers/tutorControllers.js";


const route = Router()
route.post('/admin', createAdmin);
route.post('/admin/login', loginAdmin);
route.get('/admin/status', headerAuth, authStatus)
route.post('/admin/logout',headerAuth,logoutAdmin)
route.get('/admin/details', headerAuth, getAdminDetails);



export default route