# Fitness Planner - Database Setup Guide

This guide will walk you through setting up PostgreSQL database and configuring the backend for the Fitness Planner application.

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

---

## Step 1: Install PostgreSQL

### Option A: Windows Installation
1. Download PostgreSQL installer from: https://www.postgresql.org/download/windows/
2. Run the installer and follow these steps:
   - Choose installation directory (default is fine)
   - Select components: PostgreSQL Server, pgAdmin 4, Command Line Tools
   - Set data directory (default is fine)
   - **Set password for postgres superuser** (remember this!)
   - Set port: **5432** (default)
   - Set locale: Default
3. Complete installation and launch pgAdmin 4

### Option B: Using Docker (Alternative)
```bash
docker run --name fitness-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15
```

---

## Step 2: Create Database

### Using pgAdmin 4 (GUI):
1. Open pgAdmin 4
2. Right-click on "Databases" → "Create" → "Database"
3. Database name: `fitness_planner`
4. Owner: `postgres`
5. Click "Save"

### Using Command Line (psql):
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fitness_planner;

# Exit psql
\q
```

### Using Windows PowerShell:
```powershell
# Navigate to PostgreSQL bin directory
cd "C:\Program Files\PostgreSQL\15\bin"

# Connect to PostgreSQL
.\psql.exe -U postgres

# Create database
CREATE DATABASE fitness_planner;

# Exit
\q
```

---

## Step 3: Configure Backend Environment

1. Navigate to the server directory:
```powershell
cd server
```

2. Create `.env` file by copying the example:
```powershell
Copy-Item .env.example .env
```

3. Edit `.env` file with your credentials:
```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/fitness_planner?schema=public"

# JWT Secrets - Generate strong random keys for production
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS - Frontend URL
CORS_ORIGIN="http://localhost:5173"
```

**Important**: Replace `yourpassword` with your actual PostgreSQL password!

---

## Step 4: Install Backend Dependencies

```powershell
# Make sure you're in the server directory
cd server

# Install all dependencies
npm install
```

This will install:
- Express.js (web framework)
- Prisma (ORM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors, dotenv, zod (utilities)
- TypeScript and type definitions

---

## Step 5: Initialize Prisma and Create Database Tables

1. Generate Prisma Client:
```powershell
npm run prisma:generate
```

2. Create database migrations and apply schema:
```powershell
npx prisma migrate dev --name init
```

This command will:
- Create a `migrations` folder
- Generate SQL migration files
- Apply the schema to your database
- Create all tables (users, workouts, exercises, nutrition_logs, body_measurements, goals, refresh_tokens)

3. Verify database setup:
```powershell
npx prisma studio
```

This opens Prisma Studio at `http://localhost:5555` where you can view your database tables.

---

## Step 6: Start the Backend Server

### Development Mode (with auto-reload):
```powershell
npm run dev
```

The server will start at: `http://localhost:5000`

You should see:
```
🚀 Server running on http://localhost:5000
📊 Environment: development
```

### Test the server:
Open your browser or use curl:
```powershell
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-12-14T..."}
```

---

## Database Schema Overview

The database includes the following tables:

### 1. **users**
- User authentication and profile information
- Stores: email, password (hashed), name, age, gender, height, weight

### 2. **refresh_tokens**
- JWT refresh tokens for authentication
- Linked to users (one-to-many)

### 3. **workouts**
- Workout sessions with name, description, date, duration
- Linked to users (one-to-many)

### 4. **exercises**
- Individual exercises within workouts
- Stores: name, sets, reps, weight, notes
- Linked to workouts (one-to-many)

### 5. **nutrition_logs**
- Daily meal logging
- Stores: date, mealType, foodName, calories, protein, carbs, fats
- Linked to users (one-to-many)

### 6. **body_measurements**
- Progress tracking measurements
- Stores: date, weight, bodyFat, chest, waist, hips, arms, thighs
- Linked to users (one-to-many)

### 7. **goals**
- Fitness goals and targets
- Stores: type, targetWeight, targetDate, daily macros, weekly workouts
- Linked to users (one-to-many)

---

## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and invalidate refresh token

### Workouts (`/api/workouts`) 🔒 Protected
- `GET /api/workouts` - Get all user workouts (with date filters)
- `GET /api/workouts/:id` - Get specific workout
- `POST /api/workouts` - Create new workout with exercises
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Nutrition (`/api/nutrition`) 🔒 Protected
- `GET /api/nutrition` - Get all nutrition logs
- `GET /api/nutrition/daily-totals` - Get daily macro totals
- `POST /api/nutrition` - Log new meal
- `PUT /api/nutrition/:id` - Update meal log
- `DELETE /api/nutrition/:id` - Delete meal log

### Progress (`/api/progress`) 🔒 Protected
- `GET /api/progress` - Get all measurements
- `GET /api/progress/latest` - Get latest measurement
- `GET /api/progress/analysis` - Get progress analysis with trends
- `POST /api/progress` - Add new measurement
- `PUT /api/progress/:id` - Update measurement
- `DELETE /api/progress/:id` - Delete measurement

### User (`/api/user`) 🔒 Protected
- `GET /api/user/profile` - Get user profile with BMI
- `PUT /api/user/profile` - Update profile
- `GET /api/user/goals` - Get all goals
- `GET /api/user/goals/active` - Get active goal
- `POST /api/user/goals` - Create new goal
- `PUT /api/user/goals/:id` - Update goal
- `DELETE /api/user/goals/:id` - Delete goal

🔒 = Requires `Authorization: Bearer <token>` header

---

## Testing with Postman

### 1. Install Postman
Download from: https://www.postman.com/downloads/

### 2. Create Workspace
- Open Postman
- Create new workspace: "Fitness Planner API"

### 3. Set Environment Variables
- Click "Environments" → "Create Environment"
- Name: "Local Development"
- Variables:
  - `base_url` = `http://localhost:5000`
  - `access_token` = (leave empty, will be set automatically)

### 4. Test Authentication Flow

**A. Signup Request:**
```
POST {{base_url}}/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User",
  "age": 25,
  "gender": "male"
}
```

**B. Login Request:**
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Copy the `accessToken` from response and set it in your environment.

**C. Protected Request Example:**
```
GET {{base_url}}/api/user/profile
Authorization: Bearer {{access_token}}
```

### 5. Import Sample Collection
Create a collection with all endpoints following the API structure above.

---

## Troubleshooting

### Issue: "Connection refused" or "ECONNREFUSED"
**Solution**: Ensure PostgreSQL service is running
```powershell
# Check PostgreSQL status (Windows Services)
Get-Service -Name postgresql*

# Or restart the service
Restart-Service -Name postgresql-x64-15
```

### Issue: "database does not exist"
**Solution**: Create the database using Step 2 commands

### Issue: "password authentication failed"
**Solution**: Update `DATABASE_URL` in `.env` with correct password

### Issue: "Port 5000 already in use"
**Solution**: Change `PORT` in `.env` to another port (e.g., 5001)

### Issue: Prisma Client not generated
**Solution**: Run `npm run prisma:generate` again

### Issue: Migration fails
**Solution**: 
1. Delete `prisma/migrations` folder
2. Drop and recreate database
3. Run `npx prisma migrate dev --name init` again

---

## Production Deployment Checklist

- [ ] Use strong JWT secrets (minimum 32 characters)
- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Use connection pooling for database
- [ ] Set up database backups
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Use PM2 or similar for process management

---

## Next Steps

1. ✅ Backend server is running
2. ✅ Database is configured and tables are created
3. ✅ Authentication endpoints are ready
4. ✅ All CRUD endpoints are implemented
5. 🔄 Test all endpoints with Postman
6. 🔄 Connect frontend to backend APIs
7. 🔄 Replace mock data in frontend with real API calls

---

## Useful Commands Reference

```powershell
# Server commands
npm run dev              # Start development server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm start                # Start production server

# Prisma commands
npx prisma studio        # Open database GUI at localhost:5555
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create and apply new migration
npx prisma migrate reset # Reset database (WARNING: deletes all data)
npx prisma db push       # Push schema changes without migration
npx prisma format        # Format schema file

# Database commands (psql)
psql -U postgres -d fitness_planner  # Connect to database
\dt                                   # List all tables
\d users                              # Describe users table
\q                                    # Quit psql
```

---

## Support

If you encounter any issues:
1. Check the server logs for error messages
2. Verify PostgreSQL is running: `Get-Service postgresql*`
3. Verify `.env` configuration is correct
4. Check database connection: `npx prisma studio`
5. Ensure all dependencies are installed: `npm install`

---

**Server Directory Structure:**
```
server/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Business logic
│   ├── routes/                # API routes
│   ├── middleware/            # Auth middleware
│   ├── utils/                 # Helper functions
│   └── server.ts              # Express app entry
├── .env                       # Environment variables (DO NOT COMMIT)
├── .env.example               # Environment template
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

Happy coding! 🚀
