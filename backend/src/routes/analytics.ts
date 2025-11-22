import express, { Response } from 'express';
import AnalyticsEvent from '../models/Analytics.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Helper to parse user agent
const parseUserAgent = (userAgent: string) => {
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  const isTablet = /Tablet|iPad/i.test(userAgent);
  
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (isMobile) deviceType = 'mobile';
  else if (isTablet) deviceType = 'tablet';

  let os = 'Unknown';
  if (/Windows/i.test(userAgent)) os = 'Windows';
  else if (/Mac/i.test(userAgent)) os = 'macOS';
  else if (/Linux/i.test(userAgent)) os = 'Linux';
  else if (/Android/i.test(userAgent)) os = 'Android';
  else if (/iOS|iPhone|iPad/i.test(userAgent)) os = 'iOS';

  let browser = 'Unknown';
  if (/Chrome/i.test(userAgent)) browser = 'Chrome';
  else if (/Safari/i.test(userAgent)) browser = 'Safari';
  else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
  else if (/Edge/i.test(userAgent)) browser = 'Edge';

  return { type: deviceType, os, browser };
};

// POST /api/analytics/track - Track customer event
router.post('/track', async (req, res: Response) => {
  try {
    const { eventType, productId, categoryId, page, metadata } = req.body;

    if (!eventType) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Event type is required',
          code: 'VALIDATION_ERROR',
          status: 400,
        },
      });
    }

    // Get or create session ID from cookie
    let sessionId = req.cookies.sessionId;
    if (!sessionId) {
      sessionId = crypto.randomBytes(32).toString('hex');
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }

    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const device = parseUserAgent(userAgent);
    const referrer = req.headers.referer || req.headers.referrer;

    // Create analytics event
    await AnalyticsEvent.create({
      eventType,
      sessionId,
      productId: productId || undefined,
      categoryId: categoryId || undefined,
      page,
      referrer,
      userAgent,
      ipAddress,
      deviceType: device.type,
      browser: device.browser,
      os: device.os,
      metadata: metadata || {},
    });

    res.json({
      success: true,
      message: 'Event tracked successfully',
    });
  } catch (error: any) {
    console.error('Track event error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while tracking event',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// GET /api/admin/analytics - Get analytics data
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const [analytics, popularProducts, deviceAnalytics] = await Promise.all([
      (AnalyticsEvent as any).getAnalytics(start, end),
      (AnalyticsEvent as any).getPopularProducts(start, end, 5),
      (AnalyticsEvent as any).getDeviceAnalytics(start, end),
    ]);

    res.json({
      success: true,
      data: { 
        analytics,
        popularProducts,
        deviceAnalytics,
      },
    });
  } catch (error: any) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while fetching analytics',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

export default router;
