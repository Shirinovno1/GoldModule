import { connectDB, disconnectDB } from '../db/connection.js';
import Category from '../models/Category.js';

const setupDefaultCategories = async () => {
  try {
    console.log('🏗️  Setting up default categories...');
    
    await connectDB();

    // Remove all existing categories first
    await Category.deleteMany({});
    console.log('🧹 Cleared existing categories');

    // Create default categories (excluding "Hamisi" - it's handled as "All" filter)
    const defaultCategories = [
      {
        name: 'Zərgərlik',
        description: 'Qızıl zərgərlik məhsulları',
        sortOrder: 1,
        isActive: true
      },
      {
        name: 'Qızıl Külçələri',
        description: 'Qızıl külçə məhsulları',
        sortOrder: 2,
        isActive: true
      },
      {
        name: 'Qızıl Sikkələr',
        description: 'Qızıl sikkə məhsulları',
        sortOrder: 3,
        isActive: true
      }
    ];

    for (const categoryData of defaultCategories) {
      const category = await Category.create(categoryData);
      console.log(`✅ Created category: ${category.name}`);
    }

    // Count total categories
    const totalCount = await Category.countDocuments();
    console.log(`📊 Total categories: ${totalCount}`);

    console.log('🎉 Default categories setup completed successfully!');
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Default categories setup failed:', error);
    process.exit(1);
  }
};

setupDefaultCategories();