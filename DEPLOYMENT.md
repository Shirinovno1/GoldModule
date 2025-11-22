# Deployment Guide

## 🚀 Production Deployment

### Prerequisites

- Node.js 18+ installed
- MongoDB 6+ running
- Domain name configured
- SSL certificate (Let's Encrypt recommended)

### Option 1: Manual Deployment

#### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
# Follow: https://docs.mongodb.com/manual/installation/

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Clone and Setup

```bash
# Clone repository
git clone <your-repo-url>
cd gold-selling-platform

# Install dependencies
npm install

# Setup client configuration
npm run setup:client -- \
  --name="Your Business" \
  --phone="+1234567890" \
  --whatsapp="+1234567890" \
  --primary="#D4AF37"

# Copy and edit .env
cp .env.client-your-business .env
nano .env
```

#### 3. Configure Environment

Edit `.env` for production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gold-platform-prod

# Generate secure secrets
JWT_SECRET=<generate-64-char-random-string>
JWT_REFRESH_SECRET=<generate-64-char-random-string>

# Your business details
BUSINESS_NAME=Your Business Name
PRIMARY_COLOR=#D4AF37
PHONE_NUMBER=+1234567890
WHATSAPP_NUMBER=+1234567890

# CORS (your domain)
CORS_ORIGIN=https://yourdomain.com
```

#### 4. Build Application

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build
```

#### 5. Seed Database

```bash
cd backend
npm run seed
```

#### 6. Start with PM2

```bash
# Start backend
cd backend
pm2 start dist/server.js --name gold-backend

# Serve frontend with nginx (see below)
```

#### 7. Configure Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend
    location / {
        root /path/to/gold-selling-platform/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Uploads
    location /uploads {
        alias /path/to/gold-selling-platform/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 8. Setup PM2 Startup

```bash
pm2 startup
pm2 save
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile (Frontend)

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Create Dockerfile (Backend)

```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

#### 3. Create docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: gold-platform

  backend:
    build: ./backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/gold-platform
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    depends_on:
      - mongodb
    volumes:
      - ./uploads:/app/uploads

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### 4. Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🔒 Security Checklist

### Before Going Live

- [ ] Change default admin password
- [ ] Generate strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable MongoDB authentication
- [ ] Set up backup strategy
- [ ] Configure rate limiting
- [ ] Review file upload limits
- [ ] Set up monitoring/alerts

### Recommended Security Headers

Add to nginx config:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## 📊 Monitoring

### Setup PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Health Checks

Monitor these endpoints:
- `GET /health` - Server health
- MongoDB connection status
- Disk space for uploads
- Memory usage
- CPU usage

## 🔄 Updates & Maintenance

### Update Application

```bash
# Pull latest code
git pull

# Install dependencies
npm install

# Rebuild
npm run build

# Restart services
pm2 restart gold-backend
```

### Database Backup

```bash
# Backup MongoDB
mongodump --db gold-platform --out /backup/$(date +%Y%m%d)

# Restore
mongorestore --db gold-platform /backup/20240101/gold-platform
```

### Backup Uploads

```bash
# Backup uploads directory
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Restore
tar -xzf uploads-backup-20240101.tar.gz
```

## 🌐 Multi-Client Deployment

### Separate Instances

For each client, deploy a separate instance:

```bash
# Client 1
npm run setup:client -- --name="Client 1" --phone="+111"
cp .env.client-client-1 .env
# Deploy to client1.yourdomain.com

# Client 2
npm run setup:client -- --name="Client 2" --phone="+222"
cp .env.client-client-2 .env
# Deploy to client2.yourdomain.com
```

### Shared Infrastructure

Use subdomains with different databases:

```env
# Client 1
MONGODB_URI=mongodb://localhost:27017/gold-client1

# Client 2
MONGODB_URI=mongodb://localhost:27017/gold-client2
```

## 📈 Performance Optimization

### Enable Gzip Compression

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### Enable Caching

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|webp)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### Database Indexes

Ensure indexes are created (automatic with models):
- Products: name, category, price, featured
- Sessions: sessionId, lastActivity
- Configuration: singleton

## 🆘 Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs gold-backend

# Check MongoDB
sudo systemctl status mongod

# Check ports
sudo netstat -tulpn | grep :5000
```

### Images Not Loading

```bash
# Check uploads directory permissions
chmod -R 755 uploads/

# Check nginx configuration
sudo nginx -t
sudo systemctl reload nginx
```

### Database Connection Issues

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string in .env
# Ensure MongoDB is accessible
```

## 📞 Support

For deployment issues:
1. Check logs: `pm2 logs`
2. Verify environment variables
3. Test API endpoints
4. Check nginx error logs: `/var/log/nginx/error.log`

## 🎉 Post-Deployment

After successful deployment:
1. ✅ Test all features
2. ✅ Change admin password
3. ✅ Add products via API or admin panel
4. ✅ Test mobile responsiveness
5. ✅ Configure monitoring
6. ✅ Set up backups
7. ✅ Test contact buttons (call/WhatsApp)
8. ✅ Verify analytics tracking

**Your platform is now live!** 🚀
