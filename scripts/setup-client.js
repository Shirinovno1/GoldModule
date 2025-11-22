#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const config = {};

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].substring(2);
    const value = args[i + 1];
    config[key] = value;
    i++;
  }
}

// Validate required fields
const required = ['name', 'phone'];
const missing = required.filter(field => !config[field]);

if (missing.length > 0) {
  console.error('❌ Missing required fields:', missing.join(', '));
  console.log('\nUsage:');
  console.log('  npm run setup:client -- --name="Business Name" --phone="+1234567890" [options]');
  console.log('\nRequired:');
  console.log('  --name          Business name');
  console.log('  --phone         Phone number');
  console.log('\nOptional:');
  console.log('  --whatsapp      WhatsApp number (defaults to phone)');
  console.log('  --primary       Primary color (hex, default: #D4AF37)');
  console.log('  --accent        Accent color (hex, default: #B48F40)');
  console.log('  --logo          Path to logo file');
  console.log('  --email         Contact email');
  console.log('  --instagram     Instagram URL');
  console.log('  --facebook      Facebook URL');
  process.exit(1);
}

// Set defaults
const clientConfig = {
  BUSINESS_NAME: config.name,
  PHONE_NUMBER: config.phone,
  WHATSAPP_NUMBER: config.whatsapp || config.phone,
  PRIMARY_COLOR: config.primary || '#D4AF37',
  ACCENT_COLOR: config.accent || '#B48F40',
  CONTACT_EMAIL: config.email || '',
  INSTAGRAM_URL: config.instagram || '',
  FACEBOOK_URL: config.facebook || '',
  LOGO_PATH: config.logo || '',
};

// Generate client-specific .env file
const clientSlug = config.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const envFileName = `.env.client-${clientSlug}`;
const envPath = path.join(__dirname, '..', envFileName);

let envContent = `# Client Configuration: ${config.name}\n`;
envContent += `# Generated: ${new Date().toISOString()}\n\n`;

// Add base configuration
envContent += `# Database\n`;
envContent += `MONGODB_URI=mongodb://localhost:27017/gold-platform-${clientSlug}\n\n`;

envContent += `# JWT\n`;
envContent += `JWT_SECRET=${generateSecret()}\n`;
envContent += `JWT_REFRESH_SECRET=${generateSecret()}\n\n`;

envContent += `# Server\n`;
envContent += `PORT=5000\n`;
envContent += `NODE_ENV=production\n\n`;

envContent += `# White-Label Configuration\n`;
for (const [key, value] of Object.entries(clientConfig)) {
  if (value) {
    envContent += `${key}=${value}\n`;
  }
}

// Write .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ Client configuration created successfully!');
console.log(`\n📁 Configuration file: ${envFileName}`);
console.log('\n📋 Configuration:');
console.log(`   Business Name: ${clientConfig.BUSINESS_NAME}`);
console.log(`   Phone: ${clientConfig.PHONE_NUMBER}`);
console.log(`   WhatsApp: ${clientConfig.WHATSAPP_NUMBER}`);
console.log(`   Primary Color: ${clientConfig.PRIMARY_COLOR}`);
console.log(`   Accent Color: ${clientConfig.ACCENT_COLOR}`);

if (clientConfig.LOGO_PATH) {
  console.log(`   Logo: ${clientConfig.LOGO_PATH}`);
}

console.log('\n🚀 Next steps:');
console.log(`   1. Copy ${envFileName} to .env`);
console.log(`   2. Review and update the configuration if needed`);
console.log(`   3. Run: npm install`);
console.log(`   4. Run: npm run dev`);
console.log(`   5. Access admin panel and complete setup`);

// Generate seed data script
const seedScript = `
// Seed script for ${config.name}
// Run this after starting the server to initialize the database

const config = ${JSON.stringify(clientConfig, null, 2)};

// This will be used by the backend to seed initial configuration
export default config;
`;

const seedPath = path.join(__dirname, '..', 'backend', 'src', 'seeds', `client-${clientSlug}.ts`);
const seedDir = path.dirname(seedPath);

if (!fs.existsSync(seedDir)) {
  fs.mkdirSync(seedDir, { recursive: true });
}

fs.writeFileSync(seedPath, seedScript);

console.log(`\n💾 Seed script created: backend/src/seeds/client-${clientSlug}.ts`);

// Helper function to generate secure random secret
function generateSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let secret = '';
  for (let i = 0; i < 64; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}
