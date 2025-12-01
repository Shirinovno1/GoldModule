import express, { Response } from 'express';
import Product from '../models/Product.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products - List products with filtering and pagination
router.get('/', async (req, res: Response) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sort = 'newest',
      featured,
    } = req.query;

    const query: any = { status: 'active' };

    // Apply filters
    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search
    let products;
    if (search) {
      products = await (Product as any).search(search as string, query);
    } else {
      products = Product.find(query);
    }

    // Sort
    switch (sort) {
      case 'price_asc':
        products = products.sort({ price: 1 });
        break;
      case 'price_desc':
        products = products.sort({ price: -1 });
        break;
      case 'name':
        products = products.sort({ name: 1 });
        break;
      case 'newest':
      default:
        products = products.sort({ createdAt: -1 });
        break;
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      products.skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        products: items,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while fetching products',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// GET /api/products/:id - Get product details
router.get('/:id', async (req, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.status === 'archived') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND',
          status: 404,
        },
      });
    }

    // Increment view count
    await (product as any).incrementViewCount();

    res.json({
      success: true,
      data: { product },
    });
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while fetching product',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// POST /api/admin/products - Create product
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const productData = req.body;

    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'weight', 'purity', 'category'];
    const missingFields = requiredFields.filter(field => !productData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Missing required fields: ${missingFields.join(', ')}`,
          code: 'VALIDATION_ERROR',
          status: 400,
          details: { missingFields },
        },
      });
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: { product },
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    
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
        message: 'An error occurred while creating product',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// PUT /api/admin/products/:id - Update product
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND',
          status: 404,
        },
      });
    }

    // Update fields
    Object.assign(product, req.body);
    await product.save();

    res.json({
      success: true,
      data: { product },
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    
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
        message: 'An error occurred while updating product',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

// DELETE /api/admin/products/:id - Delete product (soft delete)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND',
          status: 404,
        },
      });
    }

    // Soft delete by setting status to archived
    product.status = 'archived';
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'An error occurred while deleting product',
        code: 'INTERNAL_ERROR',
        status: 500,
      },
    });
  }
});

export default router;
