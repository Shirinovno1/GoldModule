import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
}

export interface IEvent {
  type: 'page_view' | 'product_view' | 'inquiry_initiated';
  timestamp: Date;
  productId?: mongoose.Types.ObjectId;
  metadata?: Map<string, any>;
}

export interface ICustomerSession extends Document {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  device: IDevice;
  events: IEvent[];
  firstVisit: Date;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['page_view', 'product_view', 'inquiry_initiated'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
  },
}, { _id: false });

const CustomerSessionSchema = new Schema<ICustomerSession>({
  sessionId: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  device: {
    type: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop'],
      required: true,
    },
    os: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
  },
  events: {
    type: [EventSchema],
    default: [],
  },
  firstVisit: {
    type: Date,
    default: Date.now,
    required: true,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes
CustomerSessionSchema.index({ sessionId: 1 }, { unique: true });
CustomerSessionSchema.index({ 'events.timestamp': 1 });
CustomerSessionSchema.index({ 'events.productId': 1 });

// TTL index to automatically delete sessions after 30 days
CustomerSessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Method to add an event
CustomerSessionSchema.methods.addEvent = async function(event: Omit<IEvent, 'timestamp'>) {
  this.events.push({
    ...event,
    timestamp: new Date(),
  });
  this.lastActivity = new Date();
  return this.save();
};

// Method to get event count by type
CustomerSessionSchema.methods.getEventCount = function(eventType: string): number {
  return this.events.filter((e: IEvent) => e.type === eventType).length;
};

// Static method to create or update session
CustomerSessionSchema.statics.createOrUpdate = async function(
  sessionId: string,
  data: Partial<ICustomerSession>
) {
  const session = await this.findOne({ sessionId });
  
  if (session) {
    session.lastActivity = new Date();
    if (data.ipAddress) session.ipAddress = data.ipAddress;
    if (data.userAgent) session.userAgent = data.userAgent;
    if (data.device) session.device = data.device;
    return session.save();
  }
  
  return this.create({
    sessionId,
    ...data,
    firstVisit: new Date(),
    lastActivity: new Date(),
  });
};

// Static method to get analytics
CustomerSessionSchema.statics.getAnalytics = async function(startDate: Date, endDate: Date) {
  const sessions = await this.find({
    lastActivity: { $gte: startDate, $lte: endDate },
  });

  const totalSessions = sessions.length;
  const uniqueVisitors = new Set(sessions.map((s: ICustomerSession) => s.ipAddress)).size;
  
  let totalPageViews = 0;
  let totalProductViews = 0;
  let totalInquiries = 0;

  sessions.forEach((session: ICustomerSession) => {
    totalPageViews += session.getEventCount('page_view');
    totalProductViews += session.getEventCount('product_view');
    totalInquiries += session.getEventCount('inquiry_initiated');
  });

  return {
    totalSessions,
    uniqueVisitors,
    totalPageViews,
    totalProductViews,
    totalInquiries,
    conversionRate: totalSessions > 0 ? (totalInquiries / totalSessions) * 100 : 0,
  };
};

const CustomerSession = mongoose.model<ICustomerSession>('CustomerSession', CustomerSessionSchema);

export default CustomerSession;
