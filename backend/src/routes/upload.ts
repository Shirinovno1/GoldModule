import express, { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs, { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { processImage } from '../utils/imageProcessor.js';
import crypto from 'crypto';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_ROOT = path.join(__dirname, '../../../uploads');
const TEMP_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'temp');
const PRODUCT_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'products');

if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

if (!fs.existsSync(PRODUCT_UPLOAD_DIR)) {
  fs.mkdirSync(PRODUCT_UPLOAD_DIR, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${crypto.randomBytes(16).toString('hex')}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/webp', 
    'image/heic', 
    'image/heif',
    'image/tiff',
    'image/bmp',
    'image/gif'
  ];
  
  // Also check file extension for HEIC files (sometimes mimetype is not detected correctly)
  const fileExt = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp', '.gif'];
  
  // Block HEIC/HEIF for now due to codec issues
  if (fileExt === '.heic' || fileExt === '.heif' || file.mimetype === 'image/heic' || file.mimetype === 'image/heif') {
    cb(new Error('HEIC formatı dəstəklənmir. Zəhmət olmasa JPG, PNG və ya WebP formatında yükləyin.'));
    return;
  }
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error(`Dəstəklənməyən fayl formatı: ${file.mimetype || fileExt}. Dəstəklənən formatlar: JPEG, PNG, WebP, TIFF, BMP, GIF`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB - much larger limit
    files: 20, // Allow up to 20 files
  },
});

// POST /api/admin/upload - Upload and process image
router.post('/', authenticate, (req: AuthRequest, res: Response) => {
  upload.single('image')(req, res, async (uploadError) => {
    try {
      // Handle multer errors first
      if (uploadError) {
        console.error('Multer upload error:', uploadError);
        let errorMessage = 'Şəkil yükləmə xətası';
        
        if (uploadError.code === 'LIMIT_FILE_SIZE') {
          errorMessage = 'Fayl ölçüsü çox böyükdür (maksimum 100MB)';
        } else if (uploadError.code === 'LIMIT_FILE_COUNT') {
          errorMessage = 'Çox sayda fayl seçildi (maksimum 20 fayl)';
        } else if (uploadError.message.includes('Dəstəklənməyən fayl formatı')) {
          errorMessage = uploadError.message;
        } else {
          errorMessage = `Yükləmə xətası: ${uploadError.message}`;
        }
        
        return res.status(400).json({
          success: false,
          error: {
            message: errorMessage,
            code: 'UPLOAD_ERROR',
            status: 400,
            details: uploadError.message,
          },
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Şəkil faylı seçilmədi',
            code: 'NO_FILE',
            status: 400,
          },
        });
      }

      console.log('Processing file:', req.file.originalname, 'Size:', req.file.size, 'Type:', req.file.mimetype);

      const inputPath = req.file.path;
      const outputDir = PRODUCT_UPLOAD_DIR;
      const filename = req.file.filename;

      // Process image
      const processedImages = await processImage(inputPath, outputDir, filename);

      // Convert absolute paths to relative URLs
      const baseUrl = '/uploads/products';
      const images = {
        original: `${baseUrl}/${path.basename(processedImages.original)}`,
        thumbnail: `${baseUrl}/${path.basename(processedImages.thumbnail)}`,
        medium: `${baseUrl}/${path.basename(processedImages.medium)}`,
        large: `${baseUrl}/${path.basename(processedImages.large)}`,
      };

      // Delete temp file
      try {
        await fsPromises.unlink(inputPath);
      } catch (unlinkError) {
        console.warn('Could not delete temp file:', unlinkError);
      }

      res.json({
        success: true,
        data: { images },
      });
    } catch (error: any) {
      console.error('Image processing error:', error);
      
      let errorMessage = 'Şəkil emal edilərkən xəta baş verdi';
      if (error.message.includes('Input file contains unsupported image format')) {
        errorMessage = 'Dəstəklənməyən şəkil formatı. Zəhmət olmasa JPEG, PNG, WebP və ya HEIC faylı seçin';
      } else if (error.message.includes('Input file is missing')) {
        errorMessage = 'Şəkil faylı tapılmadı və ya zədələnib';
      } else if (error.message.includes('Input buffer contains unsupported image format')) {
        errorMessage = 'Şəkil faylı zədələnib və ya dəstəklənmir';
      }
      
      res.status(500).json({
        success: false,
        error: {
          message: errorMessage,
          code: 'PROCESSING_ERROR',
          status: 500,
          details: error.message,
        },
      });
    }
  });
});

// POST /api/admin/upload/multiple - Upload multiple images
router.post('/multiple', authenticate, (req: AuthRequest, res: Response) => {
  upload.array('images', 20)(req, res, async (uploadError) => {
    try {
      // Handle multer errors first
      if (uploadError) {
        console.error('Multer multiple upload error:', uploadError);
        let errorMessage = 'Şəkillər yükləmə xətası';
        
        if (uploadError.code === 'LIMIT_FILE_SIZE') {
          errorMessage = 'Bəzi faylların ölçüsü çox böyükdür (maksimum 100MB)';
        } else if (uploadError.code === 'LIMIT_FILE_COUNT') {
          errorMessage = 'Çox sayda fayl seçildi (maksimum 20 fayl)';
        } else if (uploadError.message.includes('Dəstəklənməyən fayl formatı')) {
          errorMessage = uploadError.message;
        } else {
          errorMessage = `Yükləmə xətası: ${uploadError.message}`;
        }
        
        return res.status(400).json({
          success: false,
          error: {
            message: errorMessage,
            code: 'UPLOAD_ERROR',
            status: 400,
            details: uploadError.message,
          },
        });
      }

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Şəkil faylları seçilmədi',
            code: 'NO_FILES',
            status: 400,
          },
        });
      }

      console.log(`Processing ${req.files.length} files`);

      const outputDir = PRODUCT_UPLOAD_DIR;
      const processedImagesArray = [];
      const errors = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        try {
          console.log(`Processing file ${i + 1}/${req.files.length}:`, file.originalname);
          
          const inputPath = file.path;
          const filename = file.filename;

          // Process image
          const processedImages = await processImage(inputPath, outputDir, filename);

          // Convert to relative URLs
          const baseUrl = '/uploads/products';
          processedImagesArray.push({
            original: `${baseUrl}/${path.basename(processedImages.original)}`,
            thumbnail: `${baseUrl}/${path.basename(processedImages.thumbnail)}`,
            medium: `${baseUrl}/${path.basename(processedImages.medium)}`,
            large: `${baseUrl}/${path.basename(processedImages.large)}`,
          });

          // Delete temp file
          try {
            await fsPromises.unlink(inputPath);
          } catch (unlinkError) {
            console.warn('Could not delete temp file:', unlinkError);
          }
        } catch (fileError: any) {
          console.error(`Error processing file ${file.originalname}:`, fileError);
          errors.push(`${file.originalname}: ${fileError.message}`);
          
          // Try to delete temp file even if processing failed
          try {
            await fsPromises.unlink(file.path);
          } catch (unlinkError) {
            console.warn('Could not delete failed temp file:', unlinkError);
          }
        }
      }

      if (processedImagesArray.length === 0) {
        return res.status(500).json({
          success: false,
          error: {
            message: 'Heç bir şəkil emal edilə bilmədi',
            code: 'ALL_PROCESSING_FAILED',
            status: 500,
            details: errors.join('; '),
          },
        });
      }

      const response: any = {
        success: true,
        data: { images: processedImagesArray },
      };

      if (errors.length > 0) {
        response.warnings = errors;
        response.message = `${processedImagesArray.length} şəkil uğurla yükləndi, ${errors.length} şəkildə xəta baş verdi`;
      }

      res.json(response);
    } catch (error: any) {
      console.error('Multiple upload processing error:', error);
      
      res.status(500).json({
        success: false,
        error: {
          message: 'Şəkillər emal edilərkən xəta baş verdi',
          code: 'PROCESSING_ERROR',
          status: 500,
          details: error.message,
        },
      });
    }
  });
});

export default router;
