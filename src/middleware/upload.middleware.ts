import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { BadRequest } from '../utils/response/common.response';
import EnvConfig from '../config/envConfig';

const isProduction = EnvConfig.NODE_ENV === 'production';
const rootPath = isProduction ? 'dist' : 'src'; // Switch based on environment

// Storage configuration for files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = '';

    if (file.fieldname === 'licensePlate') {
      uploadPath = path.join(rootPath, 'uploads/licensePlate/');
    } else if (file.fieldname === 'stnk') {
      uploadPath = path.join(rootPath, 'uploads/stnk/');
    } else if (file.fieldname === 'paymentFile') {
      uploadPath = path.join(rootPath, 'uploads/transfer/');
    } else {
      return cb(new Error('Invalid Field Name'), '');
    }

    cb(null, uploadPath);
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
    return cb(new Error('Invalid file type'));
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
