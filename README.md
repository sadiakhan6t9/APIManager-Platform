# APIManager Platform

A complete, production-ready API Service Management platform built with Next.js, Node.js, Express, and MongoDB.

## Features

✨ **API Key Management** - Generate, revoke, and monitor API keys with comprehensive access control

👥 **Team Hierarchy** - Manage Submasters with role-based permissions and access control

📊 **Usage Analytics** - Track token usage, costs, and performance metrics in real-time

💳 **Credit System** - Flexible credit-based billing with detailed transaction history

🔐 **Security** - JWT authentication, rate limiting, and encrypted API keys

🎨 **Dark Theme UI** - Modern, responsive design inspired by VibeAPI

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT with bcrypt
- **Deployment**: Docker, Docker Compose

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/APIManager-Platform.git
cd APIManager-Platform
```

2. Install dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure environment variables
```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/apimanager
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

4. Start the development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## API Documentation

### Authentication
```
POST /api/auth/register - Register a new user
POST /api/auth/login - Login user
```

### API Keys
```
GET /api/keys - List all API keys
POST /api/keys - Create new API key
DELETE /api/keys/:id - Revoke API key
```

### Analytics
```
GET /api/analytics/usage - Get usage statistics
GET /api/analytics/costs - Get cost breakdown
```

## Project Structure

```
.
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── utils/
└── README.md
```

## License

MIT
