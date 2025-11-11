import * as multer from 'multer';
import * as path from 'path';

// Define the directory where uploaded images will be stored
const UPLOAD_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'uploads',
  'product_images'
);

// Configure storage destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the directory exists (in a real app, you'd use fs.mkdirSync)
    cb(null, UPLOAD_DIR);
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
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
    files: 1, // Only allow one file per request
  },
});

// Export a single file upload middleware function
export const uploadProductImage = upload.single('productImage');
