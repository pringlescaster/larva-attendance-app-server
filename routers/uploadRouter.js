// routers/uploadRouter.js
import express from 'express';
import { uploadFile, uploadMiddleware } from '../controllers/uploadController.js'; // Update this path

const router = express.Router();

// Route for file uploads
router.post('/upload', uploadMiddleware, uploadFile);

export default router;
