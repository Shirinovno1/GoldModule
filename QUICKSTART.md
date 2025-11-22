# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Your First Client

```bash
npm run setup:client -- \
  --name="Golden Jewels" \
  --phone="+1234567890" \
  --whatsapp="+1234567890" \
  --primary="#D4AF37"
```

This creates `.env.client-golden-jewels` with your configuration.

### 3. Copy Configuration

```bash
cp .env.client-golden-jewels .env
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run directly
mongod
```

### 5. Seed the Database

```bash
cd backend
npm run seed
```

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **IMPORTANT:** Change this password immediately after first login!

### 6. Start Development Servers

```bash
# From root directory
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 7. Access the Application

- **Customer Site:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin (coming soon)

## 📁 Project Structure

```
gold-selling-platform/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── scripts/           # Setup scripts
└── uploads/           # Image storage (created automatically)
```

## 🎨 Customization

### Change Branding

Edit `.env` file:

```env
BUSINESS_NAME=Your Business Name
PRIMARY_COLOR=#D4AF37
ACCENT_COLOR=#B48F40
PHONE_NUMBER=+1234567890
WHATSAPP_NUMBER=+1234567890
```

Restart the server to see changes.

### Add Products

Use the API or admin panel (when built) to add products.

Example API call:

```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=YOUR_TOKEN" \
  -d '{
    "name": "24K Gold Bar",
    "description": "Pure 24K gold bar",
    "price": 50000,
    "weight": "10g",
    "purity": "99.99%",
    "category": "bars",
    "images": [],
    "status": "active"
  }'
```

## 🔧 Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Default: `mongodb://localhost:27017/gold-selling-platform`

### Port Already in Use

- Frontend: Change port in `frontend/vite.config.ts`
- Backend: Change `PORT` in `.env`

### Images Not Uploading

- Ensure `uploads/` directory exists
- Check file permissions
- Max file size: 10MB

## 📚 Next Steps

1. **Add Products:** Use the API to add your gold products
2. **Customize Content:** Edit hero section, about page
3. **Configure Colors:** Match your brand colors
4. **Upload Logo:** Add your business logo
5. **Test Mobile:** Check responsive design on mobile devices

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- Review API endpoints in backend routes
- Check browser console for errors

## 🎉 You're Ready!

Your gold-selling platform is now running. Start customizing and adding products!
