import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gold-selling-platform',

  // JWT - Short session for security
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-this',
  jwtExpiresIn: '30m', // 30 minutes only
  jwtRefreshExpiresIn: '30m', // No long refresh - user must login again

  // White-Label Configuration (Default values from env)
  whiteLabel: {
    businessName: process.env.BUSINESS_NAME || 'ShirinovGold',
    primaryColor: process.env.PRIMARY_COLOR || '#D4AF37',
    accentColor: process.env.ACCENT_COLOR || '#B48F40',
    phoneNumber: process.env.PHONE_NUMBER || '',
    whatsappNumber: process.env.WHATSAPP_NUMBER || '',
    contactEmail: process.env.CONTACT_EMAIL || '',
    logoPath: process.env.LOGO_PATH || '',
    instagramUrl: process.env.INSTAGRAM_URL || '',
    facebookUrl: process.env.FACEBOOK_URL || '',
  },

  // AWS S3
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET || '',
  },

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 500 requests per windowMs (increased for development)
    loginMax: 20, // limit login attempts to 20 per windowMs (increased for development)
  },
};
