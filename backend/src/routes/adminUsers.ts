import express, { Response } from 'express';
import AdminUser from '../models/AdminUser.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/users - Get all admin users (super admin only)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is super admin
    const currentUser = await AdminUser.findById(req.user!.userId);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Yalnız super admin istifadəçiləri idarə edə bilər',
          code: 'FORBIDDEN',
          status: 403,
        },
      });
    }

    const users = await AdminUser.find({}, '-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { users },
    });
  } catch (error: any) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'İstifadəçiləri yükləmə zamanı xəta baş verdi',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// POST /api/admin/users - Create new admin user (super admin only)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is super admin
    const currentUser = await AdminUser.findById(req.user!.userId);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Yalnız super admin istifadəçi yarada bilər',
          code: 'FORBIDDEN',
          status: 403,
        },
      });
    }

    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Bütün sahələr tələb olunur',
          code: 'VALIDATION_ERROR',
          status: 400,
        },
      });
    }

    // Validate role
    if (!['admin', 'super_admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Yalnız admin və ya super_admin rolları mövcuddur',
          code: 'VALIDATION_ERROR',
          status: 400,
        },
      });
    }

    // Check if email already exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Bu email artıq istifadə olunur',
          code: 'EMAIL_EXISTS',
          status: 400,
        },
      });
    }

    // Create new admin user
    const newUser = new AdminUser({
      name,
      email,
      password,
      role,
    });

    await newUser.save();

    // Return user without password
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      lastLogin: newUser.lastLogin,
    };

    res.status(201).json({
      success: true,
      data: { user: userResponse },
      message: 'İstifadəçi uğurla yaradıldı',
    });
  } catch (error: any) {
    console.error('Create admin user error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Doğrulama xətası',
          code: 'VALIDATION_ERROR',
          status: 400,
          details: error.errors,
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'İstifadəçi yaratma zamanı xəta baş verdi',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// PUT /api/admin/users/:id - Update admin user (super admin only)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is super admin
    const currentUser = await AdminUser.findById(req.user!.userId);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Yalnız super admin istifadəçi yeniləyə bilər',
          code: 'FORBIDDEN',
          status: 403,
        },
      });
    }

    const { id } = req.params;
    const { name, email, role, password } = req.body;

    // Find user to update
    const user = await AdminUser.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'İstifadəçi tapılmadı',
          code: 'USER_NOT_FOUND',
          status: 404,
        },
      });
    }

    // Prevent super admin from changing their own role
    if (user._id.toString() === req.user!.userId && role !== user.role) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Öz rolunuzu dəyişə bilməzsiniz',
          code: 'CANNOT_CHANGE_OWN_ROLE',
          status: 400,
        },
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role && ['admin', 'super_admin'].includes(role)) user.role = role;
    if (password) user.password = password;

    await user.save();

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    res.json({
      success: true,
      data: { user: userResponse },
      message: 'İstifadəçi uğurla yeniləndi',
    });
  } catch (error: any) {
    console.error('Update admin user error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'İstifadəçi yeniləmə zamanı xəta baş verdi',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// DELETE /api/admin/users/:id - Delete admin user (super admin only)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is super admin
    const currentUser = await AdminUser.findById(req.user!.userId);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Yalnız super admin istifadəçi silə bilər',
          code: 'FORBIDDEN',
          status: 403,
        },
      });
    }

    const { id } = req.params;

    // Prevent super admin from deleting themselves
    if (id === req.user!.userId) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Özünüzü silə bilməzsiniz',
          code: 'CANNOT_DELETE_SELF',
          status: 400,
        },
      });
    }

    // Find and delete user
    const user = await AdminUser.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'İstifadəçi tapılmadı',
          code: 'USER_NOT_FOUND',
          status: 404,
        },
      });
    }

    res.json({
      success: true,
      message: 'İstifadəçi uğurla silindi',
    });
  } catch (error: any) {
    console.error('Delete admin user error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'İstifadəçi silmə zamanı xəta baş verdi',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

export default router;