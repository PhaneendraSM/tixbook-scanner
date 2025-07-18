# Authentication System

This document describes the authentication system implemented in the Ticket Validator application.

## Overview

The application now includes a complete authentication system with the following features:

- Login/logout functionality
- Protected routes
- Token-based authentication
- User session management
- Automatic redirects

## API Configuration

The authentication system is configured to work with the backend API at:
```
https://apis.tixbook.com
```

This URL is stored in the `.env.local` file as `NEXT_PUBLIC_API_BASE_URL`.

## Authentication Flow

### 1. Login Process
- User navigates to `/login`
- Enters email and password
- System calls `POST /api/auth/admin/login` with credentials
- On success, token and user data are stored in localStorage and cookies
- User is redirected to the main application

### 2. Protected Routes
- All main routes (`/`, `/tickets`) are protected
- Unauthenticated users are automatically redirected to `/login`
- The `ProtectedRoute` component handles this logic

### 3. Logout Process
- User clicks logout in the header dropdown
- Token and user data are removed from localStorage and cookies
- User is redirected to `/login`

## Key Components

### AuthContext (`src/contexts/AuthContext.tsx`)
- Manages authentication state across the application
- Provides user data and authentication status
- Handles login/logout functions

### AuthService (`src/lib/auth.ts`)
- Contains all authentication-related API calls
- Manages token storage and retrieval
- Provides utility functions for authentication checks

### ProtectedRoute (`src/components/ProtectedRoute.tsx`)
- Wraps protected pages
- Redirects unauthenticated users to login
- Shows loading state during authentication checks

### LoginPage (`src/app/login/page.tsx`)
- Provides the login form
- Handles form validation and submission
- Shows error messages for failed login attempts

## API Endpoints

### Login
```
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

Expected Response:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### Token Verification (Optional)
```
GET /api/auth/verify
Authorization: Bearer <token>
```

## Security Features

1. **Token Storage**: Tokens are stored in both localStorage and cookies for redundancy
2. **Automatic Logout**: Invalid tokens trigger automatic logout
3. **Route Protection**: Middleware and components prevent unauthorized access
4. **Secure Cookies**: Cookies use SameSite=Strict for security

## Usage Examples

### Using the Auth Context
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      Welcome, {user?.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls
```typescript
import { createAuthAxios } from '@/lib/auth';

const authAxios = createAuthAxios();
const response = await authAxios.get('/api/protected-endpoint');
```

## Environment Variables

Create a `.env.local` file with:
```
NEXT_PUBLIC_API_BASE_URL=https://apis.tixbook.com
```

## Testing

To test the authentication system:

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:9002`
3. You should be redirected to the login page
4. Enter valid credentials to access the application
5. Test the logout functionality from the header dropdown

## Backend Requirements

The backend API should implement:

1. `POST /api/auth/admin/login` - Admin login endpoint
2. Token validation middleware
3. Proper error responses for invalid credentials
4. JWT token generation and validation

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend allows requests from your frontend domain
2. **Token Not Found**: Check that the API is returning the expected response format
3. **Redirect Loops**: Verify that the middleware is correctly configured
4. **Environment Variables**: Ensure `.env.local` is properly configured

### Debug Mode

Enable debug logging by adding console.log statements in the auth service or checking browser developer tools for network requests and localStorage contents. 