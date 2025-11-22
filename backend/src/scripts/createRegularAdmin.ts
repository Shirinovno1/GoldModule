import { connectDB, disconnectDB } from '../db/connection.js';
import AdminUser from '../models/AdminUser.js';

const createRegularAdmin = async () => {
  try {
    console.log('👤 Creating regular admin user...');
    
    await connectDB();

    // Check if regular admin already exists
    const existingAdmin = await AdminUser.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Regular admin user already exists');
      console.log('   Email: admin@example.com');
      
      // Update password if needed
      existingAdmin.passwordHash = 'admin123';
      existingAdmin.role = 'admin';
      existingAdmin.name = 'Regular Admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log('✅ Regular admin user updated');
    } else {
      // Create new regular admin
      const admin = await AdminUser.create({
        email: 'admin@example.com',
        passwordHash: 'admin123', // Will be hashed by pre-save hook
        name: 'Regular Admin',
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Regular admin user created successfully!');
    }
    
    console.log('');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin (regular)');
    console.log('');
    console.log('🎉 Regular admin can now log in to access the dashboard!');
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create regular admin:', error);
    process.exit(1);
  }
};

createRegularAdmin();