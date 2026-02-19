# OAuth2 Google Sign-In Troubleshooting

## Error: `Error 400: invalid_request - Missing required parameter: redirect_uri`

The app builds the Google OAuth URL by appending `redirect_uri` to PocketBase's `authUrl`.
Google rejects it because the `redirect_uri` isn't registered in Google Cloud Console.

---

## Fix: Register the Redirect URI in Google Cloud Console

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID (used for this app)
3. Under **Authorized redirect URIs**, add:
   ```
   https://pb-bazar.muaz.app/api/oauth2-redirect
   ```
   > This is PocketBase's built-in OAuth callback endpoint. It handles the code exchange internally.

4. Also add your local dev URI if testing locally:
   ```
   http://localhost:3000/auth/callback
   ```

5. Click **Save** and wait ~5 minutes for Google to propagate

---

## Root Cause

The `login/page.tsx` manually appends `redirect_uri` to the `authUrl` from PocketBase:

```ts
// line 57-58 in app/login/page.tsx
const separator = googleProvider.authUrl.includes('?') ? '&' : '?'
const authUrl = `${googleProvider.authUrl}${separator}redirect_uri=${encodeURIComponent(redirectUrl)}`
```

PocketBase's `authUrl` already includes a `redirect_uri` pointing to its own endpoint (`/api/oauth2-redirect`). Appending another one either duplicates the param or sends an unregistered URI to Google.

---

## Two Valid Approaches

### Option A: Use PocketBase's built-in flow (recommended)

Remove the manual `redirect_uri` append. PocketBase handles the callback itself and redirects to your app after.

In **PocketBase Admin** (`pb-bazar.muaz.app/_/`):
- Go to **Settings → Auth providers → Google**
- Set **Allowed redirect URLs** to include: `http://localhost:3000`, `https://yourdomain.com`

In `login/page.tsx`, redirect directly to `googleProvider.authUrl` without modification:
```ts
window.location.href = googleProvider.authUrl
```

### Option B: Custom callback (current approach)

Keep the manual redirect but register `https://pb-bazar.muaz.app/api/oauth2-redirect` AND your callback URL in Google Cloud Console. PocketBase must also be configured to allow your callback origin.

---

## PocketBase Admin Checklist

1. `pb-bazar.muaz.app/_/` → **Settings → Auth providers → Google**
2. Verify **Client ID** and **Client Secret** are filled in
3. Check **Enabled** is toggled on
4. Under **Allowed redirect URLs**, add your app's origin:
   - `http://localhost:3000`
   - `https://yourdomain.com` (production)

---

## Quick Diagnostic

Open browser DevTools console on the login page and check the logged `Final auth URL`. Verify:
- It contains `redirect_uri=`
- That `redirect_uri` value is registered in Google Cloud Console
