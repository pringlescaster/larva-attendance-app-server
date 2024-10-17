// controllers/uploadController.js
import { upload } from '../config/multer.js'; // Update this path to your actual file upload module

// Upload file controller
const uploadFile = (req, res) => {
  if (req.file) {
    return res.status(200).json({ message: 'File uploaded successfully!', file: req.file });
  }
  res.status(400).json({ error: 'File upload failed!' });
};

// Middleware for handling file upload
const uploadMiddleware = upload.single('imageFieldName'); // Replace 'imageFieldName' with your actual field name

export { uploadFile, uploadMiddleware };
