import { connectDB, disconnectDB } from '../db/connection.js';
import AdminUser from '../models/AdminUser.js';

const createSuperAdmin = async () => {
  try {
    console.log('🔐 Creating super admin user...');
    
    await connectDB();

    // Check if super admin already exists
    const existingSuperAdmin = await AdminUser.findOne({ email: 'shirinovfakhri@gmail.com' });
    
    if (existingSuperAdmin) {
      console.log('ℹ️  Super admin user already exists');
      console.log('   Email: shirinovfakhri@gmail.com');
      
      // Update password if needed
      existingSuperAdmin.passwordHash = 'Ubhyhhab2#';
      existingSuperAdmin.role = 'super_admin';
      existingSuperAdmin.name = 'Fakhri Shirinov';
      existingSuperAdmin.isActive = true;
      await existingSuperAdmin.save();
      console.log('✅ Super admin user updated');
    } else {
      // Create new super admin
      const superAdmin = await AdminUser.create({
        email: 'shirinovfakhri@gmail.com',
        passwordHash: 'Ubhyhhab2#', // Will be hashed by pre-save hook
        name: 'Fakhri Shirinov',
        role: 'super_admin',
        isActive: true,
      });
      console.log('✅ Super admin user created successfully!');
    }
    
    console.log('');
    console.log('📧 Email: shirinovfakhri@gmail.com');
    console.log('🔑 Password: Ubhyhhab2#');
    console.log('👑 Role: super_admin');
    console.log('');
    console.log('🎉 You can now log in to access the secret branding page!');
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
