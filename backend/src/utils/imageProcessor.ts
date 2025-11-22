import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export interface ProcessedImages {
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}

const SIZES = {
  thumbnail: { width: 200, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 1200, height: 800 },
};

export const processImage = async (
  inputPath: string,
  outputDir: string,
  filename: string
): Promise<ProcessedImages> => {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    const ext = path.extname(filename);
    const name = path.basename(filename, ext);

    const results: ProcessedImages = {
      original: '',
      thumbnail: '',
      medium: '',
      large: '',
    };

    // Read file and convert to buffer to avoid HEIC seek issues
    const inputBuffer = await fs.readFile(inputPath);
    
    // Test if Sharp can read the image first
    const metadata = await sharp(inputBuffer).metadata();
    console.log(`Processing image: ${filename}, Format: ${metadata.format}, Size: ${metadata.width}x${metadata.height}`);
    
    if (!metadata.format) {
      throw new Error('Şəkil formatı tanınmır və ya dəstəklənmir');
    }

  // Process original (crop to 4:3 aspect ratio and optimize)
  const originalPath = path.join(outputDir, `${name}-original.webp`);
  await sharp(inputBuffer)
    .resize(1600, 1200, { fit: 'cover', position: 'center' })
    .webp({ quality: 90 })
    .toFile(originalPath);
  results.original = originalPath;

  // Generate thumbnail (square crop)
  const thumbnailPath = path.join(outputDir, `${name}-thumbnail.webp`);
  await sharp(inputBuffer)
    .resize(SIZES.thumbnail.width, SIZES.thumbnail.height, { 
      fit: 'cover', 
      position: 'center' 
    })
    .webp({ quality: 80 })
    .toFile(thumbnailPath);
  results.thumbnail = thumbnailPath;

  // Generate medium (4:3 aspect ratio)
  const mediumPath = path.join(outputDir, `${name}-medium.webp`);
  await sharp(inputBuffer)
    .resize(SIZES.medium.width, SIZES.medium.height, { 
      fit: 'cover', 
      position: 'center' 
    })
    .webp({ quality: 85 })
    .toFile(mediumPath);
  results.medium = mediumPath;

  // Generate large (4:3 aspect ratio)
  const largePath = path.join(outputDir, `${name}-large.webp`);
  await sharp(inputBuffer)
    .resize(SIZES.large.width, SIZES.large.height, { 
      fit: 'cover', 
      position: 'center' 
    })
    .webp({ quality: 90 })
    .toFile(largePath);
  results.large = largePath;

    return results;
  } catch (error: any) {
    console.error('Image processing error:', error);
    
    // Provide more specific error messages
    if (error.message.includes('Input file contains unsupported image format')) {
      throw new Error('Dəstəklənməyən şəkil formatı. Zəhmət olmasa JPEG, PNG, WebP, HEIC, TIFF, BMP və ya GIF faylı istifadə edin.');
    } else if (error.message.includes('Input file is missing')) {
      throw new Error('Şəkil faylı tapılmadı və ya oxuna bilmir.');
    } else if (error.message.includes('Input buffer contains unsupported image format')) {
      throw new Error('Şəkil faylı zədələnib və ya formatı dəstəklənmir.');
    } else if (error.message.includes('ENOENT')) {
      throw new Error('Şəkil faylı tapılmadı.');
    } else if (error.message.includes('EACCES')) {
      throw new Error('Şəkil faylına giriş icazəsi yoxdur.');
    } else {
      throw new Error(`Şəkil emal xətası: ${error.message}`);
    }
  }
};

export const deleteImages = async (images: ProcessedImages): Promise<void> => {
  const paths = [images.original, images.thumbnail, images.medium, images.large];
  
  await Promise.all(
    paths.map(async (imagePath) => {
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error(`Failed to delete image: ${imagePath}`, error);
      }
    })
  );
};
