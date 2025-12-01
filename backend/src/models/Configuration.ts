import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILogo {
  url: string;
  width: number;
  height: number;
}

interface IConfigurationModel extends Model<IConfiguration> {
  getInstance(): Promise<IConfiguration>;
  updateInstance(updates: Partial<IConfiguration>, updatedBy: mongoose.Types.ObjectId): Promise<IConfiguration>;
}

export interface IColors {
  primary: string;
  accent: string;
  background: {
    light: string;
    dark: string;
  };
}

export interface IContact {
  phone: string;
  whatsapp: string;
  email?: string;
}

export interface ISocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface ISEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface IConfiguration extends Document {
  businessName: string;
  logo: ILogo;
  colors: IColors;
  contact: IContact;
  socialMedia: ISocialMedia;
  seo: ISEO;
  updatedAt: Date;
  updatedBy: mongoose.Types.ObjectId;
}

const ConfigurationSchema = new Schema<IConfiguration>({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters'],
  },
  logo: {
    type: Schema.Types.Mixed,
    default: {
      url: '',
      width: 300,
      height: 100,
    },
  },
  colors: {
    primary: {
      type: String,
      required: [true, 'Primary color is required'],
      match: [/^#[0-9A-F]{6}$/i, 'Primary color must be a valid hex color'],
      default: '#D4AF37',
    },
    accent: {
      type: String,
      required: [true, 'Accent color is required'],
      match: [/^#[0-9A-F]{6}$/i, 'Accent color must be a valid hex color'],
      default: '#B48F40',
    },
    background: {
      light: {
        type: String,
        default: '#FCFBF8',
      },
      dark: {
        type: String,
        default: '#1A1A1A',
      },
    },
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    whatsapp: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
  },
  socialMedia: {
    instagram: {
      type: String,
      trim: true,
    },
    facebook: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
  },
  seo: {
    title: {
      type: String,
      default: 'Premium Qızıl Satışı',
      maxlength: [60, 'SEO title cannot exceed 60 characters'],
    },
    description: {
      type: String,
      default: 'Hər bir sertifikatlaşdırılmış qızıl məhsulunda keyfiyyət və orijinallığa sadiqliyimizi kəşf edin.',
      maxlength: [160, 'SEO description cannot exceed 160 characters'],
    },
    keywords: {
      type: [String],
      default: ['qızıl', 'zərgərlik', 'qızıl külçə', 'qızıl sikkə', 'investisiya'],
    },
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'AdminUser',
  },
}, {
  timestamps: true,
  collection: 'configuration',
});

// Ensure only one configuration document exists (singleton pattern)
ConfigurationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Configuration').countDocuments();
    if (count > 0) {
      throw new Error('Configuration already exists. Use update instead of create.');
    }
  }
  next();
});

// Static method to get the configuration (singleton)
ConfigurationSchema.statics.getInstance = async function(this: IConfigurationModel) {
  let config = await this.findOne();
  
  if (!config) {
    // Create default configuration if none exists
    config = await this.create({
      businessName: process.env.BUSINESS_NAME || 'ShirinovGold',
      colors: {
        primary: process.env.PRIMARY_COLOR || '#D4AF37',
        accent: process.env.ACCENT_COLOR || '#B48F40',
        background: {
          light: '#FCFBF8',
          dark: '#1A1A1A',
        },
      },
      contact: {
        phone: process.env.PHONE_NUMBER || '+1234567890',
        whatsapp: process.env.WHATSAPP_NUMBER || '+1234567890',
        email: process.env.CONTACT_EMAIL || '',
      },
      socialMedia: {
        instagram: process.env.INSTAGRAM_URL || '',
        facebook: process.env.FACEBOOK_URL || '',
      },
      seo: {
        title: `${process.env.BUSINESS_NAME || 'ShirinovGold'} - Premium Qızıl Satışı`,
        description: 'Hər bir sertifikatlaşdırılmış qızıl məhsulunda keyfiyyət və orijinallığa sadiqliyimizi kəşf edin.',
        keywords: ['qızıl', 'zərgərlik', 'qızıl külçə', 'qızıl sikkə', 'investisiya'],
      },
    });
  }
  
  return config;
};

// Static method to update configuration
ConfigurationSchema.statics.updateInstance = async function(this: IConfigurationModel, updates: Partial<IConfiguration>, updatedBy: mongoose.Types.ObjectId) {
  const config = await this.getInstance();
  Object.assign(config, updates);
  config.updatedBy = updatedBy;
  return config.save();
};

const Configuration = mongoose.model<IConfiguration, IConfigurationModel>('Configuration', ConfigurationSchema);

export default Configuration;
