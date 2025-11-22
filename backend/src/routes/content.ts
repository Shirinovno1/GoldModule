import express, { Response } from 'express';
import Content from '../models/Content.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// GET /api/content/:section - Get content section
router.get('/:section', async (req, res: Response) => {
  try {
    const { section } = req.params;

    if (!['hero', 'about', 'footer'].includes(section)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid section. Must be hero, about, or footer',
          code: 'INVALID_SECTION',
          status: 400,
        },
      });
    }

    const content = await (Content as any).getSection(section);

    res.json({
      success: true,
      data: content.data,
    });
  } catch (error: any) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while fetching content',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// PUT /api/admin/content/:section - Update content section
router.put('/:section', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { section } = req.params;
    const { data } = req.body;
    const updatedBy = req.user!.userId;

    if (!['hero', 'about', 'footer'].includes(section)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid section. Must be hero, about, or footer',
          code: 'INVALID_SECTION',
          status: 400,
        },
      });
    }

    if (!data) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Data is required',
          code: 'VALIDATION_ERROR',
          status: 400,
        },
      });
    }

    const content = await (Content as any).updateSection(section, data, updatedBy);

    res.json({
      success: true,
      data: { content },
    });
  } catch (error: any) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while updating content',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

export default router;
