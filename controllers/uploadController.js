import { upload } from '../config/multer.js'; // Update this path to your actual file upload module

// Upload file controller
const uploadFile = (req, res) => {
  if (req.file) {
    // Respond with the Cloudinary URL and other info
    return res.status(200).json({
      message: 'File uploaded successfully!',
      file: {
        url: req.file.path, // URL of the uploaded file in Cloudinary
        original_filename: req.file.originalname, // Original filename
        public_id: req.file.public_id,

      },
    });
  }
  res.status(400).json({ error: 'File upload failed!' });
};

// Middleware for handling file upload
const uploadMiddleware = upload.single('image'); // Replace 'imageFieldName' with your actual field name

export { uploadFile, uploadMiddleware };

