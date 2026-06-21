import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const useCloudinary = process.env.NODE_ENV === 'production' && 
                      process.env.CLOUDINARY_CLOUD_NAME && 
                      process.env.CLOUDINARY_API_KEY && 
                      process.env.CLOUDINARY_API_SECRET;

let upload: multer.Multer;

try {
  if (useCloudinary) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });

    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (_req: any, file: any) => {
        const isVideo = file.mimetype.startsWith('video');
        return {
          folder: 'portfolio_assets',
          resource_type: isVideo ? 'video' : 'image',
          allowed_formats: isVideo ? ['mp4', 'mov', 'avi'] : ['jpg', 'png', 'jpeg', 'webp', 'svg'],
          transformation: isVideo
            ? [{ quality: 'auto:good', fetch_format: 'mp4' }]
            : [{ quality: 'auto:good', fetch_format: 'webp' }],
        };
      },
    });
    upload = multer({ storage });
  } else {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, uploadDir);
      },
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      }
    });

    upload = multer({ storage });
  }
} catch (e: any) {
  console.warn('Upload config init failed, using fallback disk storage:', e.message);
  const fallbackDir = path.join(__dirname, '../../uploads');
  try { if (!fs.existsSync(fallbackDir)) fs.mkdirSync(fallbackDir, { recursive: true }); } catch (_) {}
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, fallbackDir),
    filename: (_req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
    }
  });
  upload = multer({ storage });
}

export { upload, cloudinary, useCloudinary };

