import { Router } from "express";
import { createAdmin, getAdmin, loginAdmin } from "../controllers/adminController.js";


const route = Router()
route.post('/admin', createAdmin);
route.post('/admin/login', loginAdmin);
route.get('/admin', getAdmin)



export default route