import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroContent {
  backgroundImage: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  description?: string;
}

export interface IAboutContent {
  title: string;
  content: string;
  image?: string;
}

export interface IFooterLink {
  label: string;
  url: string;
}

export interface IFooterContent {
  copyrightText: string;
  links: IFooterLink[];
}

export type ContentData = {
  hero?: IHeroContent;
  about?: IAboutContent;
  footer?: IFooterContent;
};

export interface IContentRevision {
  data: ContentData;
  updatedAt: Date;
  updatedBy: mongoose.Types.ObjectId;
}

export interface IContent extends Document {
  section: 'hero' | 'about' | 'footer';
  data: ContentData;
  revisions: IContentRevision[];
  updatedAt: Date;
  updatedBy: mongoose.Types.ObjectId;
}

const FooterLinkSchema = new Schema({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
}, { _id: false });

const ContentRevisionSchema = new Schema({
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'AdminUser',
    required: true,
  },
}, { _id: false });

const ContentSchema = new Schema<IContent>({
  section: {
    type: String,
    required: true,
    enum: ['hero', 'about', 'footer'],
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  revisions: {
    type: [ContentRevisionSchema],
    default: [],
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'AdminUser',
  },
}, {
  timestamps: true,
});

// Indexes
ContentSchema.index({ section: 1 }, { unique: true });

// Pre-save hook to add revision
ContentSchema.pre('save', function(next) {
  if (this.isModified('data') && !this.isNew) {
    // Add current data to revisions before updating
    this.revisions.push({
      data: this.data,
      updatedAt: new Date(),
      updatedBy: this.updatedBy,
    });

    // Keep only last 10 revisions
    if (this.revisions.length > 10) {
      this.revisions = this.revisions.slice(-10);
    }
  }
  next();
});

// Static method to get or create content section
ContentSchema.statics.getSection = async function(section: string) {
  let content = await this.findOne({ section });
  
  if (!content) {
    // Create default content based on section
    const defaultData = getDefaultContent(section);
    content = await this.create({
      section,
      data: defaultData,
    });
  }
  
  return content;
};

// Static method to update content section
ContentSchema.statics.updateSection = async function(
  section: string,
  data: ContentData,
  updatedBy: mongoose.Types.ObjectId
) {
  const content = await this.getSection(section);
  content.data = data;
  content.updatedBy = updatedBy;
  return content.save();
};

// Helper function to get default content
function getDefaultContent(section: string): ContentData {
  switch (section) {
    case 'hero':
      return {
        hero: {
          backgroundImage: '',
          headline: 'Saf Zəriflik, Əbədi Dəyər',
          subheadline: 'Zəriflik və Dəyər',
          ctaText: 'Ekspertlə Danış',
          description: 'Hər bir sertifikatlaşdırılmış qızıl məhsulunda keyfiyyət və orijinallığa sadiqliyimizi kəşf edin.',
        },
      };
    case 'about':
      return {
        about: {
          title: 'Haqqımızda',
          content: 'Biz ən yüksək keyfiyyətli qızıl məhsulları təqdim etməyə sadiqik. Hər bir məhsulumuz sertifikatlaşdırılmış təmizlik və orijinallıqla gəlir.',
          image: '',
        },
      };
    case 'footer':
      return {
        footer: {
          copyrightText: '© 2024 Bütün hüquqlar qorunur. Sertifikatlaşdırılmış Təmizlik və Sığortalı Çatdırılma.',
          links: [
            { label: 'Məxfilik Siyasəti', url: '/privacy' },
            { label: 'Xidmət Şərtləri', url: '/terms' },
            { label: 'Əlaqə', url: '/contact' },
          ],
        },
      };
    default:
      return {};
  }
}

const Content = mongoose.model<IContent>('Content', ContentSchema);

export default Content;
