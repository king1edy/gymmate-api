# NestJS Backend Authentication and Authorization Guide

This guide provides step-by-step instructions to set up JWT-based authentication and role-based authorization in a NestJS backend, referencing the current GymMate API setup.

## 1. Setup NestJS Project

```bash
npm i -g @nestjs/cli
nest new gymmate-backend
cd gymmate-backend
```

## 2. Install Required Dependencies

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs typeorm @nestjs/typeorm pg
```

## 3. Create User Entity

Define a User entity with fields like id, email, passwordHash, role, etc.

## 4. Configure TypeORM

Set up TypeORM with Postgres connection in `app.module.ts` or a dedicated config file.

## 5. Create Auth Module

Generate auth module, controller, and service:

```bash
nest g module auth
nest g controller auth
nest g service auth
```

## 6. Implement JWT Strategy

Create `jwt.strategy.ts` extending PassportStrategy with JWT validation.

## 7. Implement AuthService

- Validate user credentials with bcrypt.
- Generate JWT tokens with user info (id, email, role).
- Implement registration and login methods.

## 8. Protect Routes with Guards

- Use `JwtAuthGuard` to protect routes.
- Implement `RolesGuard` and `Roles` decorator for role-based access control.

## 9. Use Guards in Controllers

Apply guards and roles decorator to controllers or routes to restrict access.

## 10. Multi-Tenancy Support

- Pass tenant_id in JWT payload.
- Use tenant_id in service methods to scope data.
- Optionally, set session variables in DB for RLS policies.

## 11. Testing

- Write unit and e2e tests for auth flows.

## 12. Running the Application

```bash
npm run start:dev
```

---

This guide is based on the existing GymMate API backend structure and can be adapted as needed.
