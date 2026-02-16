# Authentication System

This document describes the authentication system implemented in the Bazaar Ramadan PWA.

## Overview

The application uses **PocketBase** for authentication with support for:
- Google OAuth2 authentication (primary method)
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
- Google OAuth2 login button (full-page redirect)
- Simple, clean interface
- Error handling with toast notifications
- Loading states for better UX
- Auto-creates user account on first login

### OAuth2 Callback Page (`/auth/callback`)

Handles the OAuth2 redirect after successful Google authentication. This page:
- Extracts the authorization code from URL parameters
- Exchanges the code for an auth token
- Creates user account if first-time login
- Redirects to home page after successful authentication
- Shows error message if authentication fails

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

### Google OAuth2 Flow

1. User clicks "Log Masuk dengan Google" button on `/login`
2. Client fetches OAuth2 providers from PocketBase API
3. Provider data is stored in localStorage for callback
4. User is redirected to Google's OAuth2 consent page (full page redirect)
5. User authenticates with Google and grants permissions
6. Google redirects back to `/auth/callback` with authorization code
7. Callback page exchanges code for auth token using `pb.collection('users').authWithOAuth2Code()`
8. If first-time login, PocketBase automatically creates user account
9. Auth token is stored in PocketBase authStore (localStorage)
10. User is redirected to home page
11. Auth state updates across all components using the `useAuth()` hook

### Logout

1. User clicks logout button in settings
2. Client calls `pb.authStore.clear()`
3. Auth state updates across all components
4. User is redirected to home page

## Security Features

- **OAuth2 Standard**: Uses industry-standard Google OAuth2
- **HTTPS Only**: All authentication requests use HTTPS
- **Secure Token Storage**: PocketBase stores auth tokens in localStorage
- **Auto Refresh**: PocketBase automatically refreshes expired tokens
- **CSRF Protection**: Built-in with PocketBase
- **No Password Management**: Eliminates password-related vulnerabilities

## Error Handling

All authentication errors are handled gracefully with user-friendly Malay messages:

- **OAuth2 not configured**: "Google OAuth2 tidak dikonfigurasi. Sila hubungi admin."
- **Provider not found**: "Google OAuth2 tidak dijumpai. Sila hubungi admin."
- **Callback errors**: "Pengesahan gagal" with option to retry
- **Network errors**: Handled by PocketBase client
- **Missing parameters**: "Parameter OAuth2 tidak dijumpai"

## Testing

To test the authentication system:

1. **Ensure Google OAuth2 is configured in PocketBase** (see Setup section above)
2. Start the dev server: `pnpm dev`
3. Clear any existing auth state: Open console and run `localStorage.clear()`
4. Visit `http://localhost:3000/login`
5. Click "Log Masuk dengan Google"
6. Complete Google authentication
7. Verify you're redirected back and logged in
8. Test logout functionality in settings
9. Verify auth state persists after page refresh

## Future Enhancements

- [ ] Social login with Facebook, Apple
- [ ] Profile photo upload from Google account
- [ ] Account deletion
- [ ] Multi-language support (English, Malay)
- [ ] Remember device/session management
