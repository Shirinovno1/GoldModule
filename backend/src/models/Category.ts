import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;
  image?: string;
  parentCategory?: mongoose.Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
  updateProductCount(): Promise<ICategory>;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  productCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ parentCategory: 1, isActive: 1 });
CategorySchema.index({ sortOrder: 1 });
CategorySchema.index({ name: 'text' });

// Virtual for subcategories
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory',
});

// Pre-save hook to generate slug
CategorySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    // Generate slug from name
    this.slug = this.name
      .toLowerCase()
      .replace(/[ə]/g, 'e')
      .replace(/[ı]/g, 'i')
      .replace(/[ö]/g, 'o')
      .replace(/[ü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[ş]/g, 's')
      .replace(/[ğ]/g, 'g')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Static method to get main categories (no parent)
CategorySchema.statics.getMainCategories = function() {
  return this.find({ parentCategory: null, isActive: true })
    .sort({ sortOrder: 1, name: 1 });
};

// Static method to get category tree
CategorySchema.statics.getCategoryTree = function() {
  return this.find({ isActive: true })
    .populate('subcategories')
    .sort({ sortOrder: 1, name: 1 });
};

// Method to update product count
CategorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ 
    category: this._id, 
    status: 'active' 
  });
  this.productCount = count;
  return this.save();
};

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;