import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// Configure storage destination and filename
const dirPath = './uploads/product_images/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(dirPath, { recursive: true });
    cb(null, dirPath);
  },
  filename: (req, file, cb) => {
    // Create a unique filename: productId-timestamp.extension
    const productId = req.params.id;
    const extension = path.extname(file.originalname);
    const filename = `${productId}-${Date.now()}${extension}`;
    cb(null, filename);
  },
});

// Filter to accept only image files
const fileFilter = (req: any, file: any, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    cb(null, false); // Reject file
    req.fileValidationError = 'Only image files are allowed.'; // Custom error property
  }
};

// Initialize multer middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1 MB file size limit
    files: 1, // Only allow one file per request
  },
});

// Export a single file upload middleware function
export const uploadProductImage = upload.single('productImage');
