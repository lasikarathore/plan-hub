# Fitness Planner - Backend API

Node.js + Express + TypeScript + Prisma + PostgreSQL backend for the Fitness Planner application.

## 🚀 Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

3. **Setup Database**
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npx prisma migrate dev --name init
```

4. **Start Server**
```bash
npm run dev
```

Server runs at: `http://localhost:5000`

## 📚 Complete Setup Guide

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed step-by-step instructions including:
- PostgreSQL installation
- Database creation
- Environment configuration
- Testing with Postman
- Troubleshooting

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod

## 📁 Project Structure

```
server/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── workout.controller.ts
│   │   ├── nutrition.controller.ts
│   │   ├── progress.controller.ts
│   │   └── user.controller.ts
│   ├── routes/             # API routes
│   │   ├── auth.routes.ts
│   │   ├── workout.routes.ts
│   │   ├── nutrition.routes.ts
│   │   ├── progress.routes.ts
│   │   └── user.routes.ts
│   ├── middleware/         # Custom middleware
│   │   └── auth.middleware.ts
│   ├── utils/              # Helper functions
│   │   ├── auth.ts         # JWT & password utilities
│   │   └── prisma.ts       # Prisma client
│   └── server.ts           # App entry point
├── .env                    # Environment variables (create this)
├── .env.example            # Environment template
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Workouts (Protected)
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/:id` - Get workout by ID
- `POST /api/workouts` - Create workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Nutrition (Protected)
- `GET /api/nutrition` - Get nutrition logs
- `GET /api/nutrition/daily-totals` - Get daily totals
- `POST /api/nutrition` - Create nutrition log
- `PUT /api/nutrition/:id` - Update nutrition log
- `DELETE /api/nutrition/:id` - Delete nutrition log

### Progress (Protected)
- `GET /api/progress` - Get measurements
- `GET /api/progress/latest` - Get latest measurement
- `GET /api/progress/analysis` - Get progress analysis
- `POST /api/progress` - Create measurement
- `PUT /api/progress/:id` - Update measurement
- `DELETE /api/progress/:id` - Delete measurement

### User (Protected)
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/goals` - Get goals
- `GET /api/user/goals/active` - Get active goal
- `POST /api/user/goals` - Create goal
- `PUT /api/user/goals/:id` - Update goal
- `DELETE /api/user/goals/:id` - Delete goal

## 🔐 Authentication

Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

Token expires after 15 minutes. Use refresh token to get new access token.

## 📝 Scripts

```bash
npm run dev              # Start dev server with hot reload
npm run build            # Compile TypeScript
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio GUI
```

## 🗄️ Database Schema

7 tables:
- `users` - User accounts
- `refresh_tokens` - JWT refresh tokens
- `workouts` - Workout sessions
- `exercises` - Exercise details
- `nutrition_logs` - Meal tracking
- `body_measurements` - Progress tracking
- `goals` - Fitness goals

See [schema.prisma](./prisma/schema.prisma) for complete schema.

## 🧪 Testing

Use Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

## 🔧 Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/fitness_planner"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=5000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

## 🐛 Troubleshooting

See [DATABASE_SETUP.md](./DATABASE_SETUP.md#troubleshooting) for common issues and solutions.

## 📦 Dependencies

### Production
- express - Web framework
- @prisma/client - Database client
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - CORS middleware
- dotenv - Environment variables
- zod - Schema validation

### Development
- typescript - Type safety
- tsx - TypeScript executor
- prisma - Database toolkit
- @types/* - Type definitions

## 📄 License

ISC
