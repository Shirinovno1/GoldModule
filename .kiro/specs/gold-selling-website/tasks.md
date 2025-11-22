# Implementation Plan

- [x] 1. Set up project structure and white-label configuration system
  - Initialize monorepo with frontend (React + TypeScript) and backend (Node.js + Express)
  - Set up Tailwind CSS with custom theming that reads from configuration
  - Create centralized config schema for white-label settings (business name, logo, colors, contact)
  - Create CLI setup script: `npm run setup:client -- --name="Client Name" --phone="+123" --logo="./logo.png"`
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Implement database models and connection
  - [x] 2.1 Set up MongoDB connection with Mongoose
    - Create database connection utility with pooling and error handling
    - _Requirements: 1.1, 1.3_
  
  - [x] 2.2 Create Product model
    - Define schema with name, description, price, weight, purity, category, images, specs
    - Add indexes for search and filtering
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 2.3 Create Configuration model for white-label settings
    - Define schema with business name, logo, colors, contact info, social media
    - Implement singleton pattern for one active configuration
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 2.4 Create CustomerSession model for tracking
    - Define schema for session tracking with events array
    - Add TTL index for automatic cleanup after 30 days
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 2.5 Create AdminUser model with authentication
    - Define schema with email, passwordHash, name, role
    - Implement pre-save hook for bcrypt password hashing
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [x] 2.6 Create Content model for editable sections
    - Define schema for hero, about, footer sections with versioning
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 3. Build authentication and authorization system
  - [x] 3.1 Implement JWT authentication middleware
    - Create token generation with access and refresh tokens
    - Implement middleware to verify JWT from httpOnly cookies
    - _Requirements: 6.2, 6.3_
  
  - [x] 3.2 Create admin login and logout endpoints
    - Implement POST /api/admin/login with rate limiting (5 attempts per 15 min)
    - Implement POST /api/admin/logout to invalidate tokens
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 3.3 Implement session timeout
    - Add middleware for 30-minute inactivity timeout
    - _Requirements: 6.3_

- [x] 4. Create product management API endpoints
  - [x] 4.1 Implement GET /api/products with filtering and pagination
    - Add query params for category, price range, search, sort
    - Implement pagination and search with MongoDB text indexes
    - _Requirements: 1.1, 9.1, 9.2, 9.3_
  
  - [x] 4.2 Implement GET /api/products/:id
    - Fetch single product and increment view count
    - _Requirements: 1.1_
  
  - [x] 4.3 Implement POST /api/admin/products
    - Add auth middleware and validation
    - Handle image uploads
    - _Requirements: 1.2, 1.3_
  
  - [x] 4.4 Implement PUT /api/admin/products/:id
    - Allow partial updates with auth
    - _Requirements: 1.4_
  
  - [x] 4.5 Implement DELETE /api/admin/products/:id
    - Soft delete with auth
    - _Requirements: 1.5_

- [x] 5. Build image upload and optimization system
  - [x] 5.1 Set up cloud storage (AWS S3 or Cloudinary)
    - Configure storage client and utility functions
    - _Requirements: 8.1, 8.5_
  
  - [x] 5.2 Implement image upload endpoint
    - Create POST /api/admin/upload with validation (JPEG, PNG, WebP, max 10MB)
    - _Requirements: 8.1_
  
  - [x] 5.3 Create image optimization pipeline
    - Use Sharp.js to generate multiple sizes (200px, 600px, 1200px)
    - Convert to WebP with JPEG fallback, compress 60%
    - _Requirements: 8.2, 8.4_
  
  - [x] 5.4 Implement image reordering
    - Add endpoint to update image order in product
    - _Requirements: 8.3_

- [x] 6. Create configuration management API for white-labeling
  - [x] 6.1 Implement GET /api/config (public)
    - Return current configuration with 5-minute cache
    - _Requirements: 2.1_
  
  - [x] 6.2 Implement PUT /api/admin/config
    - Update configuration with auth and validation
    - Clear cache and log changes
    - _Requirements: 2.2, 2.3, 2.4_
  
  - [x] 6.3 Create configuration initialization script
    - Seed initial config from environment variables
    - Support CLI: `npm run setup:client -- --name="Name" --phone="+123"`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 7. Build customer tracking and analytics system
  - [x] 7.1 Implement POST /api/analytics/track
    - Accept event types (page_view, product_view, inquiry_initiated)
    - Store events with session and device info
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 7.2 Create analytics aggregation service
    - Calculate visitor metrics and conversion rates
    - _Requirements: 5.4_
  
  - [x] 7.3 Implement GET /api/admin/analytics
    - Return aggregated data with date range filtering
    - _Requirements: 5.4, 5.5_

- [x] 8. Create content management API
  - [x] 8.1 Implement GET /api/content/:section
    - Fetch content for hero, about, or footer
    - _Requirements: 7.1_
  
  - [x] 8.2 Implement PUT /api/admin/content/:section
    - Update content with auth and revision history
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [x] 9. Build customer frontend - shared components
  - [x] 9.1 Create ThemeProvider component
    - Fetch config from API and inject CSS variables dynamically
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [x] 9.2 Create Header with dynamic branding
    - Display logo from config, responsive nav with mobile menu
    - Add search bar with autocomplete (desktop)
    - _Requirements: 2.2, 2.3, 3.2_
  
  - [x] 9.3 Create Footer with dynamic content
    - Display copyright with business name and social links from config
    - _Requirements: 2.2, 7.1_
  
  - [x] 9.4 Create ContactButtons component
    - Implement "Call Now" (tel:) and "WhatsApp" buttons with configured numbers
    - Support fixed positioning on mobile
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 9.5 Create LoadingSpinner and ErrorBoundary
    - Implement loading states and error handling with retry
    - _Requirements: 11.1, 11.5_

- [ ] 10. Build customer frontend - product catalog
  - [ ] 10.1 Create ProductCard component
    - Display product with lazy loading, hover effects, responsive grid
    - _Requirements: 1.1, 11.2, 12.1, 12.2_
  
  - [x] 10.2 Create ProductGrid page
    - Fetch products with pagination, infinite scroll, loading skeletons
    - _Requirements: 1.1, 11.1, 11.2_
  
  - [ ] 10.3 Create SearchFilter component
    - Real-time search (300ms debounce), category filters, price slider, sort
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [ ] 10.4 Implement search with API integration
    - Connect search to API, show results in real-time
    - _Requirements: 9.1, 9.4_

- [ ] 11. Build customer frontend - product details page
  - [ ] 11.1 Create ProductGallery component
    - Main image with zoom, thumbnail nav, swipe gestures, pinch-to-zoom
    - _Requirements: 3.3, 11.3_
  
  - [ ] 11.2 Create ProductDetails page
    - Fetch product by ID, display details, track view event
    - _Requirements: 1.1, 4.1, 4.2, 4.3, 5.2_
  
  - [ ] 11.3 Create RelatedProducts component
    - Fetch related products, horizontal scrollable carousel
    - _Requirements: 1.1_
  
  - [ ] 11.4 Implement breadcrumb navigation
    - Show path (Home > Category > Product)
    - _Requirements: 3.2_

- [ ] 12. Build customer frontend - homepage
  - [x] 12.1 Create Hero section
    - Fetch hero content, display with background image and animations
    - _Requirements: 7.1, 7.2, 12.2_
  
  - [x] 12.2 Create FeaturedProducts section
    - Fetch featured products, responsive grid
    - _Requirements: 1.1, 7.3_
  
  - [ ] 12.3 Create About section
    - Fetch about content, fade-in on scroll
    - _Requirements: 7.1_

- [ ] 13. Implement mobile-first responsive design
  - [ ] 13.1 Create responsive breakpoint system
    - Define breakpoints, mobile-first CSS, test all components
    - _Requirements: 3.1, 3.2, 3.4_
  
  - [ ] 13.2 Optimize touch interactions
    - 44px touch targets, touch feedback, swipe gestures
    - _Requirements: 3.2_
  
  - [ ] 13.3 Implement responsive images
    - Use picture element with srcset, lazy loading
    - _Requirements: 3.3, 11.2_
  
  - [ ] 13.4 Optimize mobile performance
    - Code splitting, lazy load, minimize bundle, test on 3G
    - _Requirements: 3.5, 11.2, 11.4_

- [ ] 14. Add animations and visual polish
  - [ ] 14.1 Implement scroll-triggered animations
    - Fade-in on scroll with Intersection Observer, respect prefers-reduced-motion
    - _Requirements: 12.2, 12.5_
  
  - [ ] 14.2 Create smooth page transitions
    - Route transitions, loading states, CSS transforms for 60fps
    - _Requirements: 12.1, 12.4_
  
  - [ ] 14.3 Add micro-interactions
    - Button hover/active states, ripple effect, accordion, image zoom
    - _Requirements: 12.1, 12.3_

- [ ] 15. Build admin panel - authentication and layout
  - [ ] 15.1 Create admin login page
    - Login form with validation, error messages, redirect on success
    - _Requirements: 6.1, 6.2_
  
  - [ ] 15.2 Create admin layout with sidebar
    - Responsive sidebar with navigation, user info, logout
    - _Requirements: 10.1, 10.2_
  
  - [ ] 15.3 Create ProtectedRoute component
    - Check auth, redirect to login if needed, handle token refresh
    - _Requirements: 6.1_

- [ ] 16. Build admin panel - dashboard
  - [ ] 16.1 Create Dashboard page
    - Welcome message, stat cards, recent inquiries, quick actions
    - _Requirements: 5.4_
  
  - [ ] 16.2 Create StatCard component
    - Display metric with trend indicator
    - _Requirements: 5.4_
  
  - [ ] 16.3 Create RecentInquiries table
    - Display inquiries with status badges, responsive table
    - _Requirements: 5.3, 10.2_

- [ ] 17. Build admin panel - product management
  - [ ] 17.1 Create ProductList page
    - Display products in table, search/filter, add/edit/delete actions
    - _Requirements: 1.1, 10.2_
  
  - [ ] 17.2 Create ProductEditor component
    - Form for all product fields, validation, create/edit modes
    - _Requirements: 1.2, 1.3, 1.4_
  
  - [ ] 17.3 Create ImageUploader component
    - Drag-and-drop upload, previews, reorder, progress bars
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 17.4 Implement delete confirmation modal
    - Confirmation dialog before deleting product
    - _Requirements: 1.5_

- [ ] 18. Build admin panel - configuration management
  - [ ] 18.1 Create ConfigurationPanel page
    - Form for all white-label settings with live preview
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ] 18.2 Create LogoUploader component
    - Upload logo with preview and dimension validation
    - _Requirements: 2.2_
  
  - [ ] 18.3 Create ColorPicker component
    - Color picker with preview and accessibility check
    - _Requirements: 2.3_
  
  - [ ] 18.4 Implement config save and preview
    - Save to API, success message, preview button
    - _Requirements: 2.2, 2.3, 2.4_

- [ ] 19. Build admin panel - content management
  - [ ] 19.1 Create ContentEditor page
    - Tabs for sections (Hero, About, Footer), section-specific forms
    - _Requirements: 7.1, 7.2_
  
  - [ ] 19.2 Create HeroEditor component
    - Fields for headline, subheadline, background image
    - _Requirements: 7.2_
  
  - [ ] 19.3 Create AboutEditor component
    - Fields for title, rich text content, optional image
    - _Requirements: 7.2_
  
  - [ ] 19.4 Implement content save with revision history
    - Save changes, store previous version, show last updated
    - _Requirements: 7.4, 7.5_

- [ ] 20. Build admin panel - analytics dashboard
  - [ ] 20.1 Create AnalyticsDashboard page
    - Date range picker, visitor metrics, product view chart, conversion funnel
    - _Requirements: 5.4, 5.5_
  
  - [ ] 20.2 Create VisitorMetrics component
    - Display metrics in cards with trend indicators
    - _Requirements: 5.4_
  
  - [ ] 20.3 Create ProductViewChart component
    - Line chart for product views over time (Chart.js or Recharts)
    - _Requirements: 5.4_
  
  - [ ] 20.4 Implement analytics export
    - Export button to download CSV with selected metrics
    - _Requirements: 5.5_

- [ ] 21. Implement responsive admin panel for mobile
  - [ ] 21.1 Make admin sidebar responsive
    - Collapse to hamburger menu, slide-out drawer, overlay
    - _Requirements: 10.1, 10.2_
  
  - [ ] 21.2 Optimize admin tables for mobile
    - Horizontal scroll, sticky headers, card view option
    - _Requirements: 10.2, 10.3_
  
  - [ ] 21.3 Optimize admin forms for mobile
    - Stack fields vertically, larger inputs, native mobile inputs
    - _Requirements: 10.3_
  
  - [ ] 21.4 Add mobile camera support
    - Enable camera capture for product images on mobile
    - _Requirements: 10.4_

- [ ] 22. Implement error handling and validation
  - [ ] 22.1 Create centralized error handling middleware
    - Error handler for all API routes with consistent format
    - _Requirements: 11.5_
  
  - [ ] 22.2 Add input validation for all API endpoints
    - Validate and sanitize all inputs, return detailed errors
    - _Requirements: 1.3, 6.1_
  
  - [ ] 22.3 Create Toast notification system
    - Toast component for success/error/warning/info messages
    - _Requirements: 11.5_
  
  - [ ] 22.4 Add form validation to frontend forms
    - Real-time validation with error messages below fields
    - _Requirements: 1.3, 6.1_

- [ ] 23. Implement performance optimizations
  - [ ] 23.1 Set up code splitting and lazy loading
    - Route-based splitting, lazy load admin and heavy libraries
    - _Requirements: 11.2, 11.4_
  
  - [ ] 23.2 Implement API response caching
    - Redis caching for config and product list with TTL
    - _Requirements: 11.4_
  
  - [ ] 23.3 Optimize image loading
    - Progressive loading with blur-up, WebP with JPEG fallback
    - _Requirements: 11.2, 11.3_
  
  - [ ] 23.4 Run Lighthouse audits
    - Achieve ≥90 performance score on mobile, optimize Core Web Vitals
    - _Requirements: 11.4_

- [ ] 24. Add security measures
  - [ ] 24.1 Implement rate limiting
    - Rate limit login (5/15min) and general API (100/15min)
    - _Requirements: 6.1_
  
  - [ ] 24.2 Add security headers with Helmet.js
    - Configure CSP, HSTS, X-Frame-Options headers
    - _Requirements: 6.1_
  
  - [ ] 24.3 Implement CSRF protection
    - CSRF token generation and validation
    - _Requirements: 6.1_
  
  - [ ] 24.4 Add file upload security
    - Validate file types/sizes, random file names
    - _Requirements: 8.1_

- [ ] 25. Create deployment config and documentation
  - [ ] 25.1 Create Docker configuration
    - Dockerfile for frontend/backend, docker-compose for local dev
    - _Requirements: All_
  
  - [ ] 25.2 Write deployment scripts
    - Build script, database migrations, seed script
    - _Requirements: All_
  
  - [ ] 25.3 Create white-label setup script
    - CLI to initialize config for new client with parameters
    - Example: `npm run setup:client -- --name="Golden Jewels" --phone="+123" --primary="#D4AF37"`
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ] 25.4 Write comprehensive README
    - Installation, white-label setup, config examples, API docs, troubleshooting
    - _Requirements: All_
  
  - [ ] 25.5 Create admin user guide
    - Guide for using admin panel, adding products, configuration, best practices
    - _Requirements: 1.2, 1.4, 2.2, 8.1_
