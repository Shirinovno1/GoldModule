# 🔐 Admin System Credentials

## Two Types of Admin Access

### 1. 👑 Super Admin (Creator - You)
**Email:** shirinovfakhri@gmail.com  
**Password:** Ubhyhhab2#  
**Role:** super_admin  
**Access:** Secret Branding Page (Full Control)

**What you can do:**
- Edit website branding and colors
- Manage all content (homepage, about, contact)
- Access all admin features
- Automatically redirected to `/admin/secret-branding`

### 2. 👤 Regular Admin (Staff)
**Email:** admin@example.com  
**Password:** admin123  
**Role:** admin  
**Access:** Regular Dashboard

**What they can do:**
- Manage products
- View analytics
- Handle customer inquiries
- Automatically redirected to `/admin/dashboard`

## How the Login System Works

### Single Login Page: `/admin/login`

When someone logs in at `/admin/login`, the system automatically:

1. **Checks credentials** against the database
2. **Identifies the user role** (super_admin or admin)
3. **Redirects automatically:**
   - Super Admin → `/admin/secret-branding` (your secret page)
   - Regular Admin → `/admin/dashboard` (normal admin panel)

### No Manual URL Typing Needed!

- You don't need to type `/admin/secret-branding` manually
- Regular admins can't access the secret page even if they know the URL
- The system handles everything automatically based on credentials

## Security Features

✅ **Role-based access control**  
✅ **Automatic routing based on user role**  
✅ **Password hashing and encryption**  
✅ **JWT token authentication**  
✅ **Session management**  

## Creating Additional Users

### To create more super admins:
```bash
cd backend
npm run create-super-admin
```

### To create more regular admins:
```bash
cd backend
npm run create-regular-admin
```

## Testing the System

1. **Test Super Admin Access:**
   - Go to: http://localhost:3000/admin/login
   - Email: shirinovfakhri@gmail.com
   - Password: Ubhyhhab2#
   - Should redirect to secret branding page

2. **Test Regular Admin Access:**
   - Go to: http://localhost:3000/admin/login
   - Email: admin@example.com
   - Password: admin123
   - Should redirect to dashboard

## Important Notes

⚠️ **Keep your super admin credentials secure**  
⚠️ **Regular admins cannot access branding settings**  
⚠️ **Change default passwords in production**  
⚠️ **The system automatically prevents unauthorized access**

## Troubleshooting

If login doesn't work:
1. Check that both servers are running
2. Clear browser cookies and cache
3. Verify credentials are typed correctly
4. Check browser console for errors

The system is now fully set up with proper role-based access! 🎉