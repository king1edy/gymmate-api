# GymMate API - RBAC Authentication System

GymMate API implements a comprehensive Role-Based Access Control (RBAC) system that provides secure, flexible, and granular authorization for the application.

## Features

- JWT-based authentication
- Role-based access control (RBAC)
- Permission-based authorization
- Multi-tenant architecture
- User session management
- Password encryption
- Email verification
- Password reset functionality

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy .env.example and fill in your values
cp .env.example .env
```

3. Run database migrations:
```bash
npm run migration:run
```

4. Seed initial data (creates roles, permissions and super admin):
```bash
npm run seed:development
```

## Default Super Admin Credentials

After running the seed command, you can login with the following credentials:

- Email: `admin@gymmate.com`
- Password: `SuperAdmin123!`

## Built-in Roles

The system comes with the following predefined roles:

| Role | Description | Access Level |
|------|-------------|--------------|
| super_admin | Full system access | All permissions |
| admin | Gym administrator | Full gym management |
| manager | Gym manager | Limited management capabilities |
| trainer | Fitness trainer | Class & member management |
| staff | Front desk staff | Basic operations |
| member | Gym member | Self-service only |

## Permission Structure

Permissions follow this naming convention: `resource:action`

Examples:
- `users:create`
- `classes:read`
- `equipment:update`
- `access:delete`

## Using RBAC in Controllers

### Protect a Route with Roles:

```typescript
@Get('admin-route')
@Roles('admin')
async adminOnlyFunction() {
  // Only admins can access
}
```

### Require Specific Permissions:

```typescript
@Post('classes')
@RequirePermissions('classes:create')
async createClass() {
  // Only users with 'classes:create' permission can access
}
```

### Combine Roles and Permissions:

```typescript
@Put('users/:id')
@Roles('admin', 'manager')
@RequirePermissions('users:update')
async updateUser() {
  // Only admins or managers with 'users:update' permission can access
}
```

### Get Current User:

```typescript
@Get('profile')
async getProfile(@CurrentUser() user: User) {
  // Access current user properties
  return user;
}
```

## User Methods

The User entity provides several helper methods:

```typescript
// Check if user has a specific permission
user.hasPermission('users:create')

// Check if user has a specific role
user.hasRole('admin')

// Check if user has any of the roles
user.hasAnyRole(['admin', 'manager'])

// Check if user can access a specific tenant
user.canAccessTenant(tenantId)

// Get all user permissions
user.permissions

// Check if user is super admin
user.isSuperAdmin

// Check if user is tenant admin
user.isTenantAdmin
```

## Tenant Access Control

The system implements multi-tenant isolation:

```typescript
// In your service
async findAll(user: User) {
  return this.repository.find({
    where: { tenantId: user.tenantId }
  });
}
```

## Testing

The system includes unit tests for authentication and authorization. Run them with:

```bash
# Run all tests
npm test

# Run auth-related tests
npm test auth
```

## Security Best Practices

1. Always use HTTPS in production
2. Implement rate limiting for auth endpoints
3. Use secure session configuration
4. Implement proper password policies
5. Regular security audits
6. Monitor failed login attempts
7. Implement IP-based blocking
8. Use secure headers

## API Endpoints

### Authentication

```
POST /auth/register      - Register new user
POST /auth/login        - User login
POST /auth/refresh      - Refresh access token
POST /auth/logout       - User logout
GET  /auth/profile      - Get current user profile
POST /auth/verify-email - Verify email address
POST /auth/forgot-password     - Request password reset
POST /auth/reset-password      - Reset password
PUT  /auth/change-password     - Change password
```

### User Management

```
GET    /users          - List users
POST   /users          - Create user
GET    /users/:id      - Get user details
PUT    /users/:id      - Update user
DELETE /users/:id      - Delete user
```

### Role Management

```
GET    /roles           - List roles
POST   /roles           - Create role
GET    /roles/:id       - Get role details
PUT    /roles/:id       - Update role
DELETE /roles/:id       - Delete role
POST   /roles/:id/permissions - Assign permission to role
DELETE /roles/:id/permissions/:permissionId - Remove permission from role
```

### Permission Management

```
GET    /permissions     - List permissions
POST   /permissions     - Create permission
GET    /permissions/:id - Get permission details
PUT    /permissions/:id - Update permission
DELETE /permissions/:id - Delete permission
```
