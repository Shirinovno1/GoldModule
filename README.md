# Gold Selling Platform

A modular, white-label gold-selling website platform with a comprehensive admin panel. Built with React, Node.js, Express, and MongoDB.

## Features

- 🎨 **White-Label Ready** - Easy customization for multiple clients
- 📱 **Mobile-First Design** - Optimized for mobile devices
- 🛡️ **Secure Admin Panel** - Complete product and content management
- 📊 **Customer Analytics** - Track visitors and inquiries
- 📞 **Call & WhatsApp Integration** - Direct customer contact
- 🖼️ **Image Optimization** - Automatic image processing and CDN delivery
- ⚡ **High Performance** - Optimized for speed and SEO

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB 6+
- AWS S3 or Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gold-selling-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up a new client**
   ```bash
   npm run setup:client -- --name="Golden Jewels" --phone="+1234567890" --whatsapp="+1234567890" --primary="#D4AF37"
   ```

   This will generate a `.env.client-<name>` file with your configuration.

4. **Copy the generated config to .env**
   ```bash
   cp .env.client-golden-jewels .env
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

   This starts both frontend (http://localhost:3000) and backend (http://localhost:5000)

## White-Label Setup

### Easy Setup with CLI

The platform includes a CLI tool to quickly set up configurations for different clients:

```bash
npm run setup:client -- \
  --name="Client Business Name" \
  --phone="+1234567890" \
  --whatsapp="+1234567890" \
  --primary="#D4AF37" \
  --accent="#B48F40" \
  --logo="./path/to/logo.png" \
  --email="contact@business.com" \
  --instagram="https://instagram.com/business" \
  --facebook="https://facebook.com/business"
```

**Required Parameters:**
- `--name`: Business name
- `--phone`: Phone number for calls

**Optional Parameters:**
- `--whatsapp`: WhatsApp number (defaults to phone)
- `--primary`: Primary brand color (hex)
- `--accent`: Accent color (hex)
- `--logo`: Path to logo file
- `--email`: Contact email
- `--instagram`: Instagram URL
- `--facebook`: Facebook URL

### Managing Multiple Clients

You can maintain separate configurations for different clients:

```bash
# Set up Client 1
npm run setup:client -- --name="Golden Jewels" --phone="+1111111111"

# Set up Client 2
npm run setup:client -- --name="Silver Palace" --phone="+2222222222"

# Switch between clients by copying the appropriate .env file
cp .env.client-golden-jewels .env
# or
cp .env.client-silver-palace .env
```

## Project Structure

```
gold-selling-platform/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── config/          # Configuration
│   │   ├── styles/          # Global styles
│   │   └── main.tsx         # Entry point
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   └── server.ts        # Entry point
│   └── package.json
├── scripts/
│   └── setup-client.js      # Client setup CLI
└── package.json             # Root package.json
```

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables

```env
MONGODB_URI=mongodb://localhost:27017/gold-platform
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### White-Label Variables

```env
BUSINESS_NAME=Your Business Name
PRIMARY_COLOR=#D4AF37
ACCENT_COLOR=#B48F40
PHONE_NUMBER=+1234567890
WHATSAPP_NUMBER=+1234567890
```

### Storage Variables (Choose one)

**AWS S3:**
```env
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket
```

**Cloudinary:**
```env
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

## Development

### Running in Development Mode

```bash
# Start both frontend and backend
npm run dev

# Or run separately
npm run dev:frontend
npm run dev:backend
```

### Building for Production

```bash
npm run build
```

### Starting Production Server

```bash
npm start
```

## Admin Panel

Access the admin panel at `http://localhost:3000/admin`

**Default Admin Credentials:**
- Email: admin@example.com
- Password: admin123

⚠️ **Important:** Change the default admin password immediately after first login!

### Admin Features

- **Dashboard** - Overview of products, inquiries, and analytics
- **Products** - Add, edit, delete products with image management
- **Content** - Edit homepage hero, about section, footer
- **Configuration** - Update white-label settings (logo, colors, contact)
- **Analytics** - View visitor metrics and product performance
- **Settings** - Manage admin users and system settings

## API Documentation

### Public Endpoints

- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get product details
- `GET /api/config` - Get white-label configuration
- `GET /api/content/:section` - Get content section
- `POST /api/analytics/track` - Track customer events

### Admin Endpoints (Requires Authentication)

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/upload` - Upload images
- `PUT /api/admin/config` - Update configuration
- `PUT /api/admin/content/:section` - Update content
- `GET /api/admin/analytics` - Get analytics data

## Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d
```

### Manual Deployment

1. Build the frontend and backend
2. Set up MongoDB
3. Configure environment variables
4. Start the backend server
5. Serve frontend static files with nginx or similar

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Image Upload Issues

- Verify AWS S3 or Cloudinary credentials
- Check file size limits (max 10MB)
- Ensure proper permissions on storage bucket

### Port Already in Use

- Frontend (3000): Change in `frontend/vite.config.ts`
- Backend (5000): Change `PORT` in `.env`

## License

Proprietary - All rights reserved

## Support

For support, email support@example.com or open an issue in the repository.
