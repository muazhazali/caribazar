# Authentication System

This document describes the authentication system implemented in the Bazaar Ramadan PWA.

## Overview

The application uses **PocketBase** for authentication with support for:
- Email/Password authentication
- Google OAuth2 authentication
- Session management with automatic refresh
- Client-side auth state management

## Setup

### 1. Google OAuth2 Configuration

To enable Google authentication, configure OAuth2 in your PocketBase admin panel:

1. Navigate to your PocketBase admin panel: `https://pb-bazar.muaz.app/_/`
2. Go to **Settings** → **Auth providers**
3. Enable **Google** provider
4. Configure the OAuth2 credentials:
   - **Client ID**: Your Google OAuth2 client ID
   - **Client Secret**: Your Google OAuth2 client secret
   - **Redirect URL**: `https://your-domain.com/auth/callback`

For local development, add `http://localhost:3000/auth/callback` as an authorized redirect URI in your Google Cloud Console.

### 2. Environment Variables

The following environment variables are configured in `.env.local`:

```bash
NEXT_PUBLIC_POCKETBASE_URL=https://pb-bazar.muaz.app
POCKETBASE_URL=https://pb-bazar.muaz.app
```

## Pages

### Login Page (`/login`)

Features:
- Email/password login form
- Google OAuth2 login button
- Link to registration page
- Error handling with toast notifications
- Loading states for better UX

### Register Page (`/register`)

Features:
- User registration form (username, email, password, confirm password)
- Google OAuth2 registration button
- Password validation (min 8 characters)
- Auto-login after successful registration
- Link to login page
- Duplicate email/username error handling

### OAuth2 Callback Page (`/auth/callback`)

A minimal page that handles the OAuth2 redirect. This page is opened in a popup window during the OAuth2 flow and is automatically closed after successful authentication.

## Authentication Hook

### `useAuth()` Hook

Located at `hooks/use-auth.ts`, this hook provides:

```typescript
const { user, isAuthenticated, isLoading, logout } = useAuth()
```

- `user`: Current authenticated user (PBUser | null)
- `isAuthenticated`: Boolean indicating if user is logged in
- `isLoading`: Boolean indicating if auth state is being initialized
- `logout`: Function to log out the current user

## User Interface

### PBUser Type

```typescript
interface PBUser {
  id: string
  email: string
  username: string
  name?: string
  avatar?: string
  role?: 'user' | 'mod' | 'admin'
  created: string
  updated: string
}
```

### Profile Page Integration

The profile page (`/profile`) shows:
- Login/Register buttons when not authenticated
- User profile information when authenticated
- Avatar management
- Account statistics

### Settings Page Integration

The settings page (`/settings`) includes:
- Account section with current user email
- Logout button
- Only visible when authenticated

## Authentication Flow

### Email/Password Login

1. User enters email and password
2. Client calls `pb.collection('users').authWithPassword(email, password)`
3. PocketBase validates credentials and returns auth token
4. Token is stored in PocketBase authStore (localStorage)
5. User is redirected to home page
6. Auth state updates across all components using the hook

### Google OAuth2 Flow

1. User clicks "Login with Google" button
2. Client fetches OAuth2 providers from PocketBase
3. OAuth2 URL is opened in a popup window
4. User authenticates with Google
5. Google redirects to `/auth/callback` with authorization code
6. Client exchanges code for auth token using `pb.collection('users').authWithOAuth2Code()`
7. Popup closes, user is authenticated
8. User is redirected to home page

### Registration

1. User fills registration form
2. Client validates inputs (password length, matching passwords, etc.)
3. Client calls `pb.collection('users').create()` with user data
4. After successful registration, auto-login is performed
5. User is redirected to home page

### Logout

1. User clicks logout button in settings
2. Client calls `pb.authStore.clear()`
3. Auth state updates across all components
4. User is redirected to home page

## Security Features

- **Password Requirements**: Minimum 8 characters
- **HTTPS Only**: All authentication requests use HTTPS
- **HTTP-Only Cookies**: PocketBase stores auth tokens securely
- **Auto Refresh**: PocketBase automatically refreshes expired tokens
- **CSRF Protection**: Built-in with PocketBase

## Error Handling

All authentication errors are handled gracefully with user-friendly messages:

- **Login errors**: "Log masuk gagal. Sila cuba lagi."
- **Registration errors**: Specific messages for duplicate email/username
- **OAuth2 errors**: "Log masuk dengan Google gagal"
- **Network errors**: Handled by PocketBase client

## Testing

To test the authentication system:

1. Start the dev server: `pnpm dev`
2. Visit `http://localhost:3000/register` to create a new account
3. Try registering with email/password
4. Try logging in with the created account
5. Test Google OAuth2 (requires OAuth2 setup in PocketBase)
6. Test logout functionality in settings

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Social login with Facebook, Apple
- [ ] Profile photo upload
- [ ] Account deletion
