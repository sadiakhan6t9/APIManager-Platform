# APIManager Platform - Complete Deployment Guide

## Project Overview
A complete API Service Management platform built with Next.js (Frontend), Node.js/Express (Backend), and MongoDB (Database). This guide covers setup, deployment, and running instructions.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn
- Git

## Project Structure
```
APIManager-Platform/
├── backend/          # Express.js REST API
├── frontend/         # Next.js React Application
├── package.json      # Root package.json
├── COMPLETE_IMPLEMENTATION.md
└── DEPLOYMENT_GUIDE.md  (this file)
```

## Part 1: Backend Setup & Deployment

### 1.1 Backend Dependencies
All backend files are in the `/backend` folder:
- server.js - Main Express server
- models/ - MongoDB schemas
- routes/ - API endpoints
- middleware/ - Authentication & validation

### 1.2 Backend Installation
```bash
# Navigate to project root
cd APIManager-Platform

# Install backend dependencies
npm install

# Create .env file in root
echo 'MONGODB_URI=mongodb://localhost:27017/apimanager' > .env
echo 'JWT_SECRET=your_jwt_secret_key' >> .env
echo 'PORT=5000' >> .env
echo 'NODE_ENV=development' >> .env
```

### 1.3 Backend Environment Variables (.env)
```
MONGODB_URI=mongodb://localhost:27017/apimanager
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
NODE_ENV=development
API_KEY_LENGTH=32
```

### 1.4 Start Backend Server
```bash
# Development mode with nodemon
npm run dev

# Or production mode
npm start
```

### 1.5 Backend API Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/dashboard/overview - Get dashboard stats
- POST /api/keys/create - Create API key
- GET /api/transactions - Get transactions list
- GET /api/usage - Get usage analytics
- POST /api/submasters/create - Add submaster
- GET /api/pricing - Get pricing info

## Part 2: Frontend Setup & Deployment

### 2.1 Frontend Installation
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo 'NEXT_PUBLIC_API_URL=http://localhost:5000/api' > .env.local
```

### 2.2 Frontend Environment Variables (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=APIManager Platform
```

### 2.3 Start Frontend Development Server
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### 2.4 Frontend Pages
- / - Dashboard overview
- /login - Login page
- /register - Registration page  
- /dashboard/api-keys - API keys management
- /dashboard/transactions - Transactions list
- /dashboard/usage - Usage analytics
- /dashboard/submasters - Submasters management
- /dashboard/profits - Profit analytics

## Part 3: Database Setup

### 3.1 MongoDB Installation (Local)
```bash
# Mac (via Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu)
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows (Download from mongodb.com)
```

### 3.2 MongoDB Cloud (Recommended for Production)
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Add connection string to .env

Example MongoDB URL:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/apimanager?retryWrites=true&w=majority
```

## Part 4: Complete Startup Guide

### Quick Start (Development)
```bash
# Terminal 1: Backend
cd APIManager-Platform
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Production Deployment

#### Backend (Heroku Example)
```bash
# Install Heroku CLI
npm install -g heroku
heroku login
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

#### Frontend (Vercel Example)
```bash
cd frontend
npm install -g vercel
vercel
# Follow prompts and set NEXT_PUBLIC_API_URL
```

#### Using Docker
```bash
# Backend Dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]

# Frontend Dockerfile
FROM node:16
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Part 5: Testing

### Test Backend
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "test123"}'
```

### Test Frontend
- Open http://localhost:3000 in browser
- Register new account
- Login with credentials
- Test all dashboard pages

## Part 6: Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Or for older versions
mongo
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001

# Or kill process using port
lsof -i :5000
kill -9 <PID>
```

### CORS Errors
Ensure backend allows frontend origin:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## Part 7: Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Setup MongoDB backups
- [ ] Configure rate limiting
- [ ] Setup error logging
- [ ] Setup uptime monitoring
- [ ] Configure CDN for frontend
- [ ] Setup caching headers

## Part 8: Scaling Considerations
- Use MongoDB Atlas for automatic scaling
- Deploy backend on Heroku, Railway, or AWS
- Deploy frontend on Vercel or Netlify
- Use Redis for session caching
- Implement API rate limiting
- Setup load balancing
- Monitor logs with ELK stack

## Support
Refer to COMPLETE_IMPLEMENTATION.md for all code files
