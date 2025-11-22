# 🔐 Super Admin Information

## Super Admin Credentials

**Email:** shirinovfakhri@gmail.com  
**Password:** Ubhyhhab2#  
**Role:** super_admin

## How to Access the Secret Branding Page

1. Go to the admin login page: `http://localhost:3000/admin/login`
2. Enter your super admin credentials
3. You will be **automatically redirected** to the secret branding page
4. No need to manually type the URL!

## What You Can Do on the Secret Branding Page

### 1. 🎨 Branding Configuration
- Change business name
- Customize primary and accent colors
- Update contact information (phone, WhatsApp, email)
- Manage social media links (Instagram, Facebook, TikTok, YouTube)

### 2. 📝 Homepage Content
Edit the hero section:
- **Başlıq** (Headline): "Saf Zəriflik, Əbədi Dəyər"
- **Alt Başlıq** (Subheadline): "Zəriflik və Dəyər"
- **Açıqlama** (Description): The main description text

### 3. ℹ️ About Page Content
- Edit the page title
- Edit the full about content/description

### 4. 📞 Contact Page
- Contact information is managed through the main contact fields
- These automatically update everywhere on the site

## Regular Admin vs Super Admin

### Super Admin (You)
- Access to secret branding page
- Can edit all website content
- Can customize colors and branding
- Full control over the platform

### Regular Admin
- Access to dashboard
- Can manage products
- Can view analytics
- Cannot access branding settings

## Creating Additional Admin Users

If you need to create regular admin users (not super admins), you can do so through the database or by creating a new script.

## Security Notes

⚠️ **IMPORTANT:**
- Keep these credentials secure
- Never share the secret branding page URL with regular admins
- The system automatically routes you based on your role
- Regular admins cannot access the branding page even if they know the URL

## Technical Details

- The login system checks your role automatically
- Super admins are redirected to `/admin/secret-branding`
- Regular admins are redirected to `/admin/dashboard`
- All content changes are saved to the database
- Changes appear immediately on the live website

## Troubleshooting

If you can't log in:
1. Make sure you're using the correct email and password
2. Check that the backend server is running on port 5001
3. Check that the frontend is running on port 3000
4. Clear your browser cache and cookies

If you need to reset your password:
```bash
cd backend
npm run create-super-admin
```

This will update your password to the default one.
