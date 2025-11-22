import express, { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Configuration from '../models/Configuration.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for logo uploads
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/logos';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const logoUpload = multer({
  storage: logoStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Yalnız şəkil faylları qəbul edilir (JPEG, PNG, GIF, SVG, WebP)'));
    }
  }
});

// GET /api/config or /api/admin/config - Get configuration
router.get('/', async (req, res: Response) => {
  try {
    const config = await Configuration.getInstance();

    res.json({
      businessName: config.businessName,
      logo: config.logo.url,
      colors: config.colors,
      contact: config.contact,
      socialMedia: config.socialMedia,
      seo: config.seo,
    });
  } catch (error: any) {
    console.error('Get config error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while fetching configuration',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// POST /api/admin/config/logo - Upload logo
router.post('/logo', authenticate, logoUpload.single('logo'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Logo faylı tələb olunur',
          code: 'FILE_REQUIRED',
          status: 400,
        },
      });
    }

    const logoUrl = `/uploads/logos/${req.file.filename}`;
    const updatedBy = req.user!.userId;

    // Update configuration with new logo
    const config = await (Configuration as any).updateInstance({
      logo: {
        url: logoUrl,
        width: 300,
        height: 100,
      }
    }, updatedBy);

    res.json({
      success: true,
      data: {
        logoUrl,
        message: 'Logo uğurla yükləndi',
      },
    });
  } catch (error: any) {
    console.error('Logo upload error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Logo yükləmə zamanı xəta baş verdi',
        code: 'UPLOAD_ERROR',
        status: 500,
      },
    });
  }
});

// PUT /api/admin/config - Update configuration
router.put('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    const updatedBy = req.user!.userId;

    const config = await (Configuration as any).updateInstance(updates, updatedBy);

    res.json({
      success: true,
      data: { config },
    });
  } catch (error: any) {
    console.error('Update config error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          status: 400,
          details: error.errors,
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while updating configuration',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

export default router;
