import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { BadRequest } from '../utils/response/common.response';

// Storage configuration for files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'licensePlate') {
      cb(null, 'src/uploads/licensePlate/');
    } else if (file.fieldname === 'stnk') {
      cb(null, 'src/uploads/stnk/');
    } else if (file.fieldname === 'paymentFile') {
      cb(null, 'src/uploads/transfer/');
    } else {
      cb(new Error('Invalid Field Name'), ''); // Correctly passing an Error object
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  }
});

// Define file filter to allow only specific file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
    return cb(new Error()); // Correctly passing an Error object
  }
  cb(null, true);
};

// Create the multer instance with the configuration
const upload = multer({ storage, fileFilter }).fields([
  { name: 'licensePlate', maxCount: 1 },
  { name: 'stnk', maxCount: 1 },
  { name: 'paymentFile', maxCount: 1 } // Add paymentFile field
]);

// Middleware function to handle file uploads
export function handleFileUploads(
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload(req, res, (err) => {
    if (err) {
      return BadRequest(res, 'Error uploading file', err.message);
    }
    next();
  });
}
