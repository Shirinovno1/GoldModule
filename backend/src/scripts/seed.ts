import { connectDB, disconnectDB } from '../db/connection.js';
import AdminUser from '../models/AdminUser.js';
import Configuration from '../models/Configuration.js';
import Content from '../models/Content.js';

const seed = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    await connectDB();

    // Check if super admin exists
    const superAdminExists = await AdminUser.findOne({ role: 'super_admin' });
    
    if (!superAdminExists) {
      console.log('⚠️  No super admin found!');
      console.log('   Run: npm run create-super-admin');
    } else {
      console.log('✅ Super admin exists');
    }

    // Initialize configuration
    const config = await (Configuration as any).getInstance();
    console.log('✅ Configuration initialized');
    console.log(`   Business: ${config.businessName}`);

    // Initialize content sections
    await (Content as any).getSection('hero');
    await (Content as any).getSection('about');
    await (Content as any).getSection('footer');
    console.log('✅ Content sections initialized');

    console.log('🎉 Database seed completed successfully!');
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
