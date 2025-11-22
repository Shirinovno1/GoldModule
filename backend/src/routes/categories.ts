import express, { Response } from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// GET /api/categories - Get all active categories (public)
router.get('/public', async (req, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('subcategories')
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while fetching categories',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// GET /api/admin/categories - Get all categories for admin
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Category.find({})
      .populate('subcategories')
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error: any) {
    console.error('Get admin categories error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while fetching categories',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// POST /api/admin/categories - Create new category
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, parentCategory, image, sortOrder } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Category name is required',
          code: 'VALIDATION_ERROR',
          status: 400,
        },
      });
    }

    const category = await Category.create({
      name,
      description,
      parentCategory: parentCategory || null,
      image,
      sortOrder: sortOrder || 0,
    });

    res.status(201).json({
      success: true,
      data: { category },
    });
  } catch (error: any) {
    console.error('Create category error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Category with this name already exists',
          code: 'DUPLICATE_ERROR',
          status: 400,
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while creating category',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// PUT /api/admin/categories/:id - Update category
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, parentCategory, image, sortOrder, isActive } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        description,
        parentCategory: parentCategory || null,
        image,
        sortOrder,
        isActive,
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Category not found',
          code: 'NOT_FOUND',
          status: 404,
        },
      });
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (error: any) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while updating category',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// DELETE /api/admin/categories/:id - Delete category
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot delete category with existing products',
          code: 'CATEGORY_HAS_PRODUCTS',
          status: 400,
        },
      });
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parentCategory: id });
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Cannot delete category with subcategories',
          code: 'CATEGORY_HAS_SUBCATEGORIES',
          status: 400,
        },
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Category not found',
          code: 'NOT_FOUND',
          status: 404,
        },
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while deleting category',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// POST /api/admin/categories/:id/update-product-count - Update product count for category
router.post('/:id/update-product-count', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Category not found',
          code: 'NOT_FOUND',
          status: 404,
        },
      });
    }

    await category.updateProductCount();

    res.json({
      success: true,
      data: { category },
    });
  } catch (error: any) {
    console.error('Update product count error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while updating product count',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

export default router;