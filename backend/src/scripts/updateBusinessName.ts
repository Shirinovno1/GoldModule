import { connectDB, disconnectDB } from '../db/connection.js';
import Configuration from '../models/Configuration.js';

const updateBusinessName = async () => {
  try {
    console.log('🔄 Updating business name to ShirinovGold...');
    
    await connectDB();

    // Update configuration with new business name
    let config = await Configuration.findOne();
    
    if (config) {
      config.businessName = 'ShirinovGold';
      config.seo.title = 'ShirinovGold - Premium Qızıl Satışı';
      await config.save();
      console.log('✅ Business name updated');
    } else {
      // Create new configuration if none exists
      await Configuration.create({
        businessName: 'ShirinovGold',
        colors: {
          primary: '#D4AF37',
          accent: '#B48F40',
          background: {
            light: '#FCFBF8',
            dark: '#1A1A1A',
          },
        },
        contact: {
          phone: process.env.PHONE_NUMBER || '+994101231045',
          whatsapp: process.env.WHATSAPP_NUMBER || '+994101231045',
          email: process.env.CONTACT_EMAIL || 'contact@shirinovgold.az',
        },
        socialMedia: {
          instagram: '',
          facebook: '',
        },
        seo: {
          title: 'ShirinovGold - Premium Qızıl Satışı',
          description: 'Hər bir sertifikatlaşdırılmış qızıl məhsulunda keyfiyyət və orijinallığa sadiqliyimizi kəşf edin.',
          keywords: ['qızıl', 'zərgərlik', 'qızıl külçə', 'qızıl sikkə', 'investisiya'],
        },
      });
      console.log('✅ Configuration created');
    }

    console.log('🎉 Business name update completed!');
    console.log('   Business Name: ShirinovGold');
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
};

updateBusinessName();