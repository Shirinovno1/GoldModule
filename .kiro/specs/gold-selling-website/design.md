# Design Document

## Overview

The gold-selling website platform is a full-stack web application built with modern technologies to deliver a premium, mobile-first experience. The system consists of two main components: a public-facing frontend for customers and a secure admin panel for business management. The architecture emphasizes modularity, performance, and ease of customization for white-labeling.

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom configuration for theming
- **Backend**: Node.js with Express
- **Database**: MongoDB for flexible schema and scalability
- **Image Storage**: Cloud storage (AWS S3 or Cloudinary) with CDN
- **Authentication**: JWT-based authentication with httpOnly cookies
- **State Management**: React Context API + React Query for server state

### Design Philosophy

The platform follows a mobile-first, component-driven architecture with emphasis on:
- **Modularity**: All branding elements configurable through database
- **Performance**: Optimized images, lazy loading, code splitting
- **Accessibility**: WCAG 2.1 AA compliance
- **Maintainability**: Clear separation of concerns, reusable components

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
├──────────────────────────┬──────────────────────────────────┤
│   Customer Frontend      │      Admin Panel                 │
│   (React SPA)            │      (React SPA)                 │
│   - Product Catalog      │      - Dashboard                 │
│   - Product Details      │      - Product Management        │
│   - Search/Filter        │      - Content Editor            │
│   - Contact Actions      │      - Analytics                 │
└──────────────────────────┴──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│                    (Express.js REST API)                     │
├─────────────────────────────────────────────────────────────┤
│  - Authentication Middleware                                 │
│  - Request Validation                                        │
│  - Rate Limiting                                             │
│  - Error Handling                                            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Product    │   Content    │   Customer   │   Analytics    │
│   Service    │   Service    │   Service    │   Service      │
└──────────────┴──────────────┴──────────────┴────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
├──────────────┬──────────────┬──────────────────────────────┤
│   MongoDB    │   Redis      │   Cloud Storage (S3)         │
│   Database   │   Cache      │   Image Assets               │
└──────────────┴──────────────┴──────────────────────────────┘
```

### Frontend Architecture

Both customer frontend and admin panel follow a similar component structure:

```
src/
├── components/
│   ├── common/          # Shared components (Button, Input, Modal)
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── product/         # Product-specific components
│   └── admin/           # Admin-specific components
├── pages/               # Page-level components
├── hooks/               # Custom React hooks
├── services/            # API service functions
├── context/             # React Context providers
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
└── config/              # Configuration files
```

## Components and Interfaces

### Core Components

#### 1. Customer Frontend Components

**Header Component**
- Responsive navigation with mobile hamburger menu
- Logo (dynamically loaded from config)
- Search bar (desktop) with autocomplete
- Dark mode toggle
- Sticky positioning on scroll

**ProductCard Component**
```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    weight: string;
    purity: string;
    images: string[];
    featured: boolean;
  };
  layout: 'grid' | 'list';
}
```

**ProductGallery Component**
- Main image display with zoom capability
- Thumbnail navigation
- Swipe gestures on mobile
- Video support for product demonstrations

**ContactButtons Component**
```typescript
interface ContactButtonsProps {
  phoneNumber: string;
  whatsappNumber: string;
  productName?: string;
  variant: 'fixed' | 'inline';
}
```

**SearchFilter Component**
- Real-time search with debouncing
- Category filters (checkboxes)
- Price range slider
- Sort options (price, name, newest)

#### 2. Admin Panel Components

**Dashboard Component**
- Statistics cards (products, inquiries, revenue)
- Recent inquiries table
- Sales performance chart
- Quick action buttons

**ProductEditor Component**
```typescript
interface ProductEditorProps {
  productId?: string; // undefined for new product
  onSave: (product: Product) => Promise<void>;
  onCancel: () => void;
}
```

**ImageUploader Component**
- Drag-and-drop interface
- Multiple file selection
- Image preview with crop/rotate tools
- Progress indicators
- Reorder functionality

**ConfigurationPanel Component**
- White-label settings form
- Live preview of changes
- Color picker with accessibility checker
- Logo upload with dimension validation

**AnalyticsDashboard Component**
- Date range selector
- Visitor metrics (unique, returning, bounce rate)
- Product view heatmap
- Inquiry conversion funnel
- Export functionality (CSV, PDF)

### API Interfaces

#### Product API

```typescript
// GET /api/products
interface GetProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name' | 'newest';
}

// POST /api/admin/products
interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  weight: string;
  purity: string;
  category: string;
  specifications: Record<string, string>;
  images: File[];
  featured: boolean;
}

// PUT /api/admin/products/:id
interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// DELETE /api/admin/products/:id
```

#### Configuration API

```typescript
// GET /api/config
interface ConfigResponse {
  businessName: string;
  logo: string;
  primaryColor: string;
  accentColor: string;
  phoneNumber: string;
  whatsappNumber: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
  };
}

// PUT /api/admin/config
interface UpdateConfigRequest extends Partial<ConfigResponse> {}
```

#### Analytics API

```typescript
// POST /api/analytics/track
interface TrackEventRequest {
  eventType: 'page_view' | 'product_view' | 'inquiry_initiated';
  productId?: string;
  metadata?: Record<string, any>;
}

// GET /api/admin/analytics
interface GetAnalyticsQuery {
  startDate: string;
  endDate: string;
  metrics: ('visitors' | 'product_views' | 'inquiries')[];
}
```

## Data Models

### Product Model

```typescript
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  purity: string;
  category: 'jewelry' | 'bars' | 'coins' | 'other';
  specifications: {
    sku?: string;
    length?: string;
    material?: string;
    [key: string]: string | undefined;
  };
  images: {
    original: string;
    thumbnail: string;
    medium: string;
    large: string;
  }[];
  featured: boolean;
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  inquiryCount: number;
}
```

### Configuration Model

```typescript
interface Configuration {
  _id: string;
  businessName: string;
  logo: {
    url: string;
    width: number;
    height: number;
  };
  colors: {
    primary: string;
    accent: string;
    background: {
      light: string;
      dark: string;
    };
  };
  contact: {
    phone: string;
    whatsapp: string;
    email?: string;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  updatedAt: Date;
  updatedBy: string; // admin user ID
}
```

### Customer Session Model

```typescript
interface CustomerSession {
  _id: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
  };
  events: {
    type: 'page_view' | 'product_view' | 'inquiry_initiated';
    timestamp: Date;
    productId?: string;
    metadata?: Record<string, any>;
  }[];
  firstVisit: Date;
  lastActivity: Date;
}
```

### Admin User Model

```typescript
interface AdminUser {
  _id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'super_admin';
  avatar?: string;
  lastLogin: Date;
  createdAt: Date;
  isActive: boolean;
}
```

### Content Model

```typescript
interface Content {
  _id: string;
  section: 'hero' | 'about' | 'footer';
  data: {
    hero?: {
      backgroundImage: string;
      headline: string;
      subheadline: string;
      ctaText: string;
    };
    about?: {
      title: string;
      content: string;
      image?: string;
    };
    footer?: {
      copyrightText: string;
      links: { label: string; url: string }[];
    };
  };
  updatedAt: Date;
  updatedBy: string;
}
```

## Error Handling

### Frontend Error Handling

**Error Boundary Component**
- Catches React component errors
- Displays user-friendly error UI
- Logs errors to monitoring service
- Provides "Try Again" action

**API Error Handling**
```typescript
interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: Record<string, any>;
}

// Error handling strategy
- 400: Display validation errors inline
- 401: Redirect to login (admin) or show auth modal
- 403: Display "Access Denied" message
- 404: Show "Not Found" page
- 500: Display generic error with retry option
- Network errors: Show offline indicator
```

**Toast Notification System**
- Success messages (green)
- Error messages (red)
- Warning messages (yellow)
- Info messages (blue)
- Auto-dismiss after 5 seconds
- Manual dismiss option

### Backend Error Handling

**Centralized Error Handler Middleware**
```typescript
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
    details?: any;
  };
  timestamp: string;
  path: string;
}
```

**Error Types**
- ValidationError: Input validation failures
- AuthenticationError: Invalid credentials or expired tokens
- AuthorizationError: Insufficient permissions
- NotFoundError: Resource not found
- ConflictError: Duplicate resource
- InternalServerError: Unexpected server errors

**Logging Strategy**
- Error logs: All errors with stack traces
- Warning logs: Validation failures, rate limit hits
- Info logs: Successful operations, user actions
- Debug logs: Detailed request/response data (dev only)

## Testing Strategy

### Unit Testing

**Frontend Unit Tests**
- Component rendering tests (React Testing Library)
- Hook behavior tests
- Utility function tests
- Form validation tests
- Target: 80% code coverage

**Backend Unit Tests**
- Service function tests
- Validation logic tests
- Utility function tests
- Target: 85% code coverage

### Integration Testing

**API Integration Tests**
- Endpoint request/response tests
- Authentication flow tests
- Database operation tests
- File upload tests
- Use test database with seed data

**Frontend Integration Tests**
- User flow tests (search, filter, view product)
- Form submission tests
- Navigation tests
- API integration tests with mock server

### End-to-End Testing

**Customer Flows**
- Browse products → View details → Initiate inquiry
- Search products → Apply filters → View results
- Navigate site → Test responsive behavior

**Admin Flows**
- Login → Add product → Upload images → Publish
- Edit configuration → Update colors → Preview changes
- View analytics → Filter by date → Export data

**Tools**: Playwright or Cypress for E2E tests

### Performance Testing

**Metrics to Monitor**
- Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals (LCP, FID, CLS)
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Bundle size analysis

**Performance Targets**
- Mobile Lighthouse Performance: ≥90
- Desktop Lighthouse Performance: ≥95
- LCP: <2.5s
- FID: <100ms
- CLS: <0.1
- Total bundle size: <300KB (gzipped)

### Accessibility Testing

**Automated Testing**
- axe-core integration in tests
- Lighthouse accessibility audits
- WAVE browser extension checks

**Manual Testing**
- Keyboard navigation testing
- Screen reader testing (NVDA, JAWS)
- Color contrast verification
- Focus management testing

## Design System

### Color Palette

The platform uses a configurable color system with defaults:

```css
/* Default Theme */
--color-primary: #D4AF37;        /* Gold */
--color-accent: #B48F40;         /* Darker gold */
--color-background-light: #FCFBF8;
--color-background-dark: #1A1A1A;
--color-text-light: #1A1A1A;
--color-text-dark: #FCFBF8;
--color-success: #10B981;
--color-error: #EF4444;
--color-warning: #F59E0B;
--color-info: #3B82F6;
```

### Typography

```css
/* Font Families */
--font-display: 'Manrope', sans-serif;
--font-serif: 'Playfair Display', serif;

/* Font Sizes (Mobile First) */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Desktop adjustments */
@media (min-width: 768px) {
  --text-3xl: 2.25rem;  /* 36px */
  --text-4xl: 3rem;     /* 48px */
}
```

### Spacing System

```css
/* Tailwind-based spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Animation Tokens

```css
/* Durations */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;

/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Common Animations */
.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.slide-up {
  animation: slideUp var(--duration-normal) var(--ease-out);
}

.scale-in {
  animation: scaleIn var(--duration-fast) var(--ease-out);
}
```

### Component Patterns

**Button Variants**
- Primary: Solid background with primary color
- Secondary: Outlined with transparent background
- Ghost: No border, transparent background
- Icon: Square/circular with icon only

**Card Patterns**
- Product Card: Image, title, price, CTA
- Stat Card: Icon, value, label, trend indicator
- Info Card: Title, description, optional image

**Form Patterns**
- Inline validation with real-time feedback
- Clear error messages below fields
- Success states with checkmarks
- Loading states with spinners
- Disabled states with reduced opacity

## Security Considerations

### Authentication Security

- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with 1-hour expiration
- Refresh tokens stored in httpOnly cookies
- CSRF protection for state-changing operations
- Rate limiting on login attempts (5 attempts per 15 minutes)

### Data Security

- Input sanitization on all user inputs
- SQL injection prevention (using MongoDB parameterized queries)
- XSS prevention (React's built-in escaping + DOMPurify for rich text)
- File upload validation (type, size, content scanning)
- Secure headers (Helmet.js middleware)

### API Security

- CORS configuration for allowed origins
- Rate limiting (100 requests per 15 minutes per IP)
- Request size limits (10MB for file uploads, 100KB for JSON)
- API key rotation capability
- Audit logging for admin actions

## Deployment Architecture

### Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                     CDN (CloudFront)                         │
│                  Static Assets + Images                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Load Balancer (ALB)                         │
└─────────────────────────────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
┌──────────────────────┐  ┌──────────────────────┐
│   App Server 1       │  │   App Server 2       │
│   (Node.js + React)  │  │   (Node.js + React)  │
└──────────────────────┘  └──────────────────────┘
                │                     │
                └──────────┬──────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Atlas Cluster                       │
│                  (Primary + Replicas)                        │
└─────────────────────────────────────────────────────────────┘
```

### Environment Configuration

**Development**
- Local MongoDB instance
- Local file storage
- Hot module reloading
- Detailed error messages

**Staging**
- Cloud MongoDB (shared cluster)
- Cloud storage (S3)
- Production-like configuration
- Error tracking enabled

**Production**
- MongoDB Atlas (dedicated cluster)
- S3 with CloudFront CDN
- Optimized builds
- Comprehensive monitoring
- Automated backups

## Performance Optimization

### Frontend Optimizations

1. **Code Splitting**
   - Route-based splitting
   - Component lazy loading
   - Vendor bundle separation

2. **Image Optimization**
   - WebP format with JPEG fallback
   - Responsive images with srcset
   - Lazy loading below fold
   - Blur-up placeholders

3. **Caching Strategy**
   - Service worker for offline support
   - Browser caching headers
   - React Query for API response caching

4. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression (Brotli/Gzip)
   - Critical CSS inlining

### Backend Optimizations

1. **Database Optimization**
   - Indexes on frequently queried fields
   - Aggregation pipelines for analytics
   - Connection pooling
   - Query result caching (Redis)

2. **API Optimization**
   - Response compression
   - Pagination for list endpoints
   - Field selection (sparse fieldsets)
   - ETags for conditional requests

3. **Caching Layers**
   - Redis for session storage
   - Redis for frequently accessed data
   - CDN for static assets
   - Browser caching headers

## Monitoring and Observability

### Application Monitoring

- **Error Tracking**: Sentry for frontend and backend errors
- **Performance Monitoring**: New Relic or DataDog APM
- **Uptime Monitoring**: Pingdom or UptimeRobot
- **Log Aggregation**: CloudWatch or ELK stack

### Metrics to Track

**Business Metrics**
- Daily active users
- Product views per session
- Inquiry conversion rate
- Popular products
- Peak traffic times

**Technical Metrics**
- API response times
- Error rates by endpoint
- Database query performance
- Cache hit rates
- Server resource utilization

### Alerting

- Error rate exceeds 1% threshold
- API response time > 2 seconds
- Server CPU > 80%
- Database connections exhausted
- Failed deployments
