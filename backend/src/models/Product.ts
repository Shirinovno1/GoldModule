import mongoose, { Schema, Document } from 'mongoose';

export interface IProductImage {
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  weight: string;
  purity: string;
  category: mongoose.Types.ObjectId;
  specifications: Map<string, string>;
  images: IProductImage[];
  featured: boolean;
  status: 'active' | 'draft' | 'archived';
  viewCount: number;
  inquiryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema({
  original: { type: String, required: true },
  thumbnail: { type: String, required: true },
  medium: { type: String, required: true },
  large: { type: String, required: true },
}, { _id: false });

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  weight: {
    type: String,
    required: [true, 'Product weight is required'],
    trim: true,
  },
  purity: {
    type: String,
    required: [true, 'Product purity is required'],
    trim: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required'],
  },
  specifications: {
    type: Map,
    of: String,
    default: new Map(),
  },
  images: {
    type: [ProductImageSchema],
    validate: {
      validator: function(images: IProductImage[]) {
        return images.length > 0;
      },
      message: 'At least one product image is required',
    },
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'draft',
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  inquiryCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for search and filtering
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ featured: 1, status: 1 });
ProductSchema.index({ createdAt: -1 });

// Virtual for primary image
ProductSchema.virtual('primaryImage').get(function() {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

// Method to increment view count
ProductSchema.methods.incrementViewCount = async function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment inquiry count
ProductSchema.methods.incrementInquiryCount = async function() {
  this.inquiryCount += 1;
  return this.save();
};

// Static method to get featured products
ProductSchema.statics.getFeatured = function(limit: number = 8) {
  return this.find({ featured: true, status: 'active' })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to search products
ProductSchema.statics.search = function(query: string, filters: any = {}) {
  const searchQuery: any = {
    $text: { $search: query },
    status: 'active',
    ...filters,
  };
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
