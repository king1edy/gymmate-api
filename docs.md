# GymMate API Documentation

## Overview
GymMate API is a comprehensive gym management system built with NestJS. It provides functionality for managing gym operations, member access, equipment, classes, marketing, and financial aspects of a gym business.

## Core Modules

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Staff, Member)
- Secure password handling
- Token management

### 2. User Management
- User registration and profile management
- Role assignment
- Profile updates
- Account status management

### 3. Gym Management
- Gym profile management
- Branch management
- Operating hours
- Facility information

### 4. Access Control
- Member access tracking
- Access card management
- Access logs
- Attendance tracking
- Access restrictions

### 5. Equipment Management
- Equipment inventory
- Maintenance scheduling
- Usage tracking
- Equipment categories
- Maintenance history

### 6. Financial Management
- Payment processing
- Membership fees
- Revenue tracking
- Expense management
- Financial reporting
- Invoice generation

### 7. Marketing
- Campaign management
- Promotion handling
- Lead tracking
- Lead source analysis
- Marketing analytics

### 8. Class Management
- Class scheduling
- Instructor assignment
- Member registration
- Attendance tracking
- Class categories

## API Endpoints

### Authentication
```
POST /auth/login
POST /auth/register
POST /auth/refresh
```

### User Management
```
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
```

### Gym Management
```
GET /gyms
GET /gyms/:id
POST /gyms
PUT /gyms/:id
DELETE /gyms/:id
```

### Access Control
```
GET /access/logs
POST /access/check
GET /access/cards
POST /access/cards
PUT /access/cards/:id
```

### Equipment
```
GET /equipment
GET /equipment/:id
POST /equipment
PUT /equipment/:id
DELETE /equipment/:id
GET /equipment/maintenance
POST /equipment/maintenance
```

### Financial
```
GET /financial/transactions
POST /financial/transactions
GET /financial/reports
GET /financial/invoices
POST /financial/payments
```

### Marketing
```
GET /marketing/campaigns
POST /marketing/campaigns
GET /marketing/leads
POST /marketing/leads
GET /marketing/promotions
POST /marketing/promotions
GET /marketing/analytics
```

### Class Management
```
GET /classes
POST /classes
PUT /classes/:id
DELETE /classes/:id
GET /classes/schedule
POST /classes/register
```

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Gym
```typescript
{
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  operatingHours: object;
  facilities: string[];
  status: string;
}
```

### AccessCard
```typescript
{
  id: string;
  userId: string;
  cardNumber: string;
  status: string;
  validFrom: Date;
  validTo: Date;
}
```

### Equipment
```typescript
{
  id: string;
  name: string;
  category: string;
  status: string;
  maintenanceSchedule: object;
  lastMaintenance: Date;
}
```

### Transaction
```typescript
{
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  date: Date;
}
```

### Campaign
```typescript
{
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: string;
  metrics: object;
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "statusCode": number,
  "message": string,
  "error": string
}
```

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/king1edy/gymmate-api.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Run migrations:
```bash
npm run typeorm migration:run
```

5. Start the development server:
```bash
npm run start:dev
```

## Testing

Run tests with:
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Database Migrations

Generate a new migration:
```bash
npm run typeorm migration:generate -n MigrationName
```

Run pending migrations:
```bash
npm run typeorm migration:run
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start:prod
```

## Environment Variables

Required environment variables:
```
DATABASE_URL=postgresql://user:password@localhost:5432/gymmate
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
```

## Security Considerations

- All passwords are hashed using bcrypt
- API endpoints are protected with JWT authentication
- Role-based access control is implemented
- Input validation is performed on all requests
- Rate limiting is enabled
- CORS is configured for security

## Support

For support, email support@gymmate.com or create an issue in the GitHub repository.
