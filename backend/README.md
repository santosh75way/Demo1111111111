# Authentication System - Backend (Node.js)

Complete authentication backend system with JWT, built with TypeScript, Express, and Prisma ORM.

## Features

- User Registration (Signup)
- User Login with JWT tokens
- Change Password
- Forgot Password
- Reset Password
- Get User Profile
- Update User Profile
- Logout
- JWT-based Authentication
- Password validation rules
- Email validation
- Secure password hashing with bcrypt
- PostgreSQL database with Prisma ORM

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Installation

1. Clone the repository:

```bash
cd auth-system
npm install
```

1. PostgreSQL must be running:

```bash
brew services start postgresql
psql -U postgres -h localhost
```

1. Create the database:

```bash
createdb -U postgres auth-system
```

1. Environment is pre-configured in `.env` file:

- `DATABASE_URL`: postgresql://postgres:postgres@localhost:5432/auth-system
- `PORT`: 8080
- `JWT_SECRET`: Your secure key
- `Email configuration`: <abhishek@gmail.com>

1. Generate Prisma Client and setup database:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

## Running the Server

### Development and Production

```bash
npm run dev
npm run build
npm run start
```
