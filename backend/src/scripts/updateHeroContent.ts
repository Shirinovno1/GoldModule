import { connectDB, disconnectDB } from '../db/connection.js';
import Content from '../models/Content.js';

const updateHeroContent = async () => {
  try {
    console.log('🔄 Updating hero content to Azerbaijani...');
    
    await connectDB();

    // Update hero content with Azerbaijani text
    const heroData = {
      hero: {
        backgroundImage: '',
        headline: 'Saf Zəriflik, Əbədi Dəyər',
        subheadline: 'Zəriflik və Dəyər',
        ctaText: 'Ekspertlə Danış',
        description: 'Hər bir sertifikatlaşdırılmış qızıl məhsulunda keyfiyyət və orijinallığa sadiqliyimizi kəşf edin.',
      },
    };

    // Find and update or create hero content
    let heroContent = await Content.findOne({ section: 'hero' });
    
    if (heroContent) {
      // Update without triggering revision system
      await Content.updateOne(
        { section: 'hero' },
        { $set: { data: heroData } }
      );
      console.log('✅ Hero content updated');
    } else {
      await Content.create({
        section: 'hero',
        data: heroData,
      });
      console.log('✅ Hero content created');
    }

    console.log('🎉 Hero content update completed!');
    console.log('   Headline:', heroData.hero.headline);
    console.log('   Description:', heroData.hero.description);
    
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
};

updateHeroContent();