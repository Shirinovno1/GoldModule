import mongoose, { Schema, Document, PipelineStage } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  eventType: 'page_view' | 'product_view' | 'inquiry' | 'contact_click' | 'whatsapp_click' | 'phone_click';
  sessionId: string;
  userId?: string;
  productId?: mongoose.Types.ObjectId;
  categoryId?: mongoose.Types.ObjectId;
  page?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  browser?: string;
  os?: string;
  country?: string;
  city?: string;
  metadata?: Map<string, any>;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  eventType: {
    type: String,
    required: true,
    enum: ['page_view', 'product_view', 'inquiry', 'contact_click', 'whatsapp_click', 'phone_click'],
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    index: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    index: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    index: true,
  },
  page: {
    type: String,
    trim: true,
  },
  referrer: {
    type: String,
    trim: true,
  },
  userAgent: {
    type: String,
    trim: true,
  },
  ipAddress: {
    type: String,
    trim: true,
  },
  deviceType: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop'],
  },
  browser: {
    type: String,
    trim: true,
  },
  os: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: new Map(),
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

// Indexes for analytics queries
AnalyticsEventSchema.index({ eventType: 1, createdAt: -1 });
AnalyticsEventSchema.index({ sessionId: 1, createdAt: -1 });
AnalyticsEventSchema.index({ createdAt: -1 });
AnalyticsEventSchema.index({ productId: 1, eventType: 1 });
AnalyticsEventSchema.index({ categoryId: 1, eventType: 1 });

// Static methods for analytics aggregation
AnalyticsEventSchema.statics.getAnalytics = async function(startDate: Date, endDate: Date) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        uniqueSessions: { $addToSet: '$sessionId' }
      }
    },
    {
      $project: {
        eventType: '$_id',
        count: 1,
        uniqueSessionCount: { $size: '$uniqueSessions' }
      }
    }
  ] as PipelineStage[];

  const results = await this.aggregate(pipeline);
  
  // Get unique sessions for the period
  const uniqueSessionsPipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$sessionId'
      }
    },
    {
      $count: 'totalSessions'
    }
  ] as PipelineStage[];

  const sessionResults = await this.aggregate(uniqueSessionsPipeline);
  const totalSessions = sessionResults[0]?.totalSessions || 0;

  const uniqueVisitorsPipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        ipAddress: { $nin: [null, '', 'unknown'] }
      }
    },
    {
      $group: {
        _id: '$ipAddress'
      }
    },
    {
      $count: 'uniqueVisitors'
    }
  ] as PipelineStage[];

  const visitorResults = await this.aggregate(uniqueVisitorsPipeline);
  const uniqueVisitors = visitorResults[0]?.uniqueVisitors || 0;

  // Process results
  const analytics = {
    totalSessions,
    uniqueVisitors,
    totalPageViews: 0,
    totalProductViews: 0,
    totalInquiries: 0,
    totalContactClicks: 0,
    conversionRate: 0,
  };

  results.forEach((result: any) => {
    switch (result.eventType) {
      case 'page_view':
        analytics.totalPageViews = result.count;
        break;
      case 'product_view':
        analytics.totalProductViews = result.count;
        break;
      case 'inquiry':
        analytics.totalInquiries = result.count;
        break;
      case 'contact_click':
      case 'whatsapp_click':
      case 'phone_click':
        analytics.totalContactClicks += result.count;
        break;
    }
  });

  // Calculate conversion rate
  if (totalSessions > 0) {
    analytics.conversionRate = (analytics.totalInquiries / totalSessions) * 100;
  }

  return analytics;
};

// Static method to get popular products
AnalyticsEventSchema.statics.getPopularProducts = async function(startDate: Date, endDate: Date, limit: number = 10) {
  const pipeline = [
    {
      $match: {
        eventType: 'product_view',
        productId: { $exists: true },
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$productId',
        viewCount: { $sum: 1 },
        uniqueViewers: { $addToSet: '$sessionId' }
      }
    },
    {
      $project: {
        productId: '$_id',
        viewCount: 1,
        uniqueViewerCount: { $size: '$uniqueViewers' }
      }
    },
    {
      $sort: { viewCount: -1 }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $unwind: '$product'
    }
  ] as PipelineStage[];

  return this.aggregate(pipeline);
};

// Static method to get device analytics
AnalyticsEventSchema.statics.getDeviceAnalytics = async function(startDate: Date, endDate: Date) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        deviceType: { $exists: true }
      }
    },
    {
      $group: {
        _id: '$deviceType',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ] as PipelineStage[];

  return this.aggregate(pipeline);
};

const AnalyticsEvent = mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);

export default AnalyticsEvent;