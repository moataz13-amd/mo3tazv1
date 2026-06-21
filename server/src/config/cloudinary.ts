import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

let upload: multer.Multer;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Dynamic import to avoid crash when cloudinary keys are missing
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
  console.warn('Warning: Cloudinary credentials missing. File uploads will use memory storage (not persisted).');
  upload = multer({ storage: multer.memoryStorage() });
}

export { upload, cloudinary };
