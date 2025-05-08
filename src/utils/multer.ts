// src/middleware/upload.ts
import multer from 'multer';

// Use memory storage so we can access file buffers for Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
});

export default upload;
