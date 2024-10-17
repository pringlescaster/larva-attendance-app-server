import { Router } from 'express';
import { admin, admins, authStatus, deleteAdmin, login, register, updateAdmin } from '../controllers/adminController.js';
import { authenticateJWT } from "../utils/authMiddleware.js";
import { upload } from '../config/multer.js';

const router = Router();

//CREATE OPERATION
router.post('/admin/register', upload.single('image'), register)
router.post('/admin/login', login)
//READ OPERATION
router.get('/admin/auth/status', authenticateJWT, authStatus)
router.get('/admins', admins)
router.get('/admin/:id', admin)
//UPDATE OPERATION
router.put('/admin/:id',upload.single('image'), updateAdmin)
//DELETE OPERATION
router.delete('/admin/:id', deleteAdmin)


export default router;