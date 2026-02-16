# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bazaar Ramadan Directory - A Progressive Web App (PWA) for discovering Ramadan bazaars across Malaysia. This is a community-driven platform with offline-first capabilities, built with Next.js and PocketBase.

**Current Status**: Phase 6 complete - Core UI, favorites system, and profile/settings pages implemented. Using mock data while PocketBase integration is in progress.

## Development Commands

```bash
# Start development server (with Turbo mode)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5.7
- **UI**: Tailwind CSS 3.4, shadcn/ui components, Lucide icons
- **Backend**: PocketBase (not yet deployed - using mock data)
- **Maps**: Leaflet.js with React-Leaflet, OpenStreetMap tiles
- **Offline**: Dexie.js (IndexedDB wrapper) for local persistence
- **Forms**: React Hook Form with Zod validation
- **Package Manager**: pnpm

## Architecture

### Directory Structure

- `/app` - Next.js App Router pages and route handlers
  - `/bazaar/[id]` - Bazaar detail page
  - `/add` - Bazaar submission form
  - `/saved` - Saved/favorited bazaars
  - `/profile`, `/settings`, `/about`, `/more` - User pages
- `/components` - Reusable React components
  - `/ui` - shadcn/ui components (auto-generated, modify with care)
  - `/map` - Map-related components (Leaflet integration)
- `/lib` - Core utilities and logic
  - `types.ts` - TypeScript interfaces and type definitions
  - `db.ts` - Dexie database schema (IndexedDB)
  - `pocketbase.ts` - PocketBase client configuration
  - `favorites.ts` - Favorites management functions
  - `mock-data.ts` - Mock bazaar data (temporary)
  - `utils.ts` - Utility functions (cn, etc.)
- `/hooks` - Custom React hooks (e.g., `use-favorites.ts`)
- `/styles` - Global CSS files

### Key Patterns

**Offline-First with Cloud Sync**:
- All favorites are stored locally in IndexedDB via Dexie
- Cloud sync happens when user is authenticated
- Optimistic UI updates with automatic rollback on error
- See `lib/favorites.ts` for implementation

**Client Components**:
- Most components use `"use client"` due to interactive features (maps, forms, favorites)
- Server components used sparingly for static content

**Data Flow**:
1. Mock data from `lib/mock-data.ts` (temporary)
2. Favorites stored in IndexedDB (`lib/db.ts`)
3. PocketBase integration pending (schema in `PRD.md`)

## Important Configuration

### Environment Variables

Copy `.env.local.example` to `.env.local`:
```bash
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

### Next.js Config Notes

- **React Strict Mode**: Disabled in `next.config.mjs` due to Leaflet re-initialization issues. Leaflet creates map instances that get destroyed/recreated in Strict Mode, causing errors.
- **TypeScript**: `ignoreBuildErrors: true` set for development flexibility. Remove before production.

### Path Aliases

Configured in `tsconfig.json` and `components.json`:
- `@/components` → `/components`
- `@/lib` → `/lib`
- `@/hooks` → `/hooks`
- `@/ui` → `/components/ui`

## Working with shadcn/ui

This project uses shadcn/ui with the "default" style and neutral base color.

- **Adding components**: Run `pnpx shadcn@latest add <component-name>`
- **Customization**: Components are in `/components/ui` and can be modified
- **Theme**: Uses CSS variables (see `app/globals.css`)
- **Icons**: Lucide React (already installed)

## Map Integration (Leaflet)

Leaflet requires client-side rendering and careful initialization:

```tsx
'use client'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components with ssr: false
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
```

**Important**: Always disable SSR for Leaflet components. Check `components/map/bazaar-map.tsx` for reference implementation.

## Database Schema (Dexie/IndexedDB)

Defined in `lib/db.ts`:
- **favorites**: Stores favorite bazaar IDs with sync status
- **cachedBazaars**: Stores full bazaar data for offline access

**Never modify the schema version without migration plan**. Dexie auto-upgrades but data loss can occur.

## PocketBase Collections (Future)

Schema defined in `PRD.md`:
- **bazaars**: Main bazaar data (name, location, photos, status)
- **food_types**: Available food categories
- **users**: User accounts and roles
- **reviews**: User reviews with ratings
- **favorites**: Cloud-synced favorites
- **reports**: User-submitted reports

## Code Style Guidelines

- Use TypeScript strictly typed interfaces (see `lib/types.ts`)
- Prefer `const` over `let`
- Use destructuring for props
- Components should have proper TypeScript types
- Use `cn()` utility for conditional className joining
- Follow existing patterns for consistency

## Known Issues & Workarounds

1. **Leaflet + React Strict Mode**: Strict mode disabled globally. If re-enabling, wrap map components in single-render logic.

2. **Z-index layers**: Bottom navigation is at `z-1000`, modals/drawers must be `z-[1050]+` to appear above it. Already configured in `components/ui/drawer.tsx`.

3. **List page scrolling**: Use `absolute inset-0` instead of `h-full` when parent has `flex-1`. See `app/page.tsx` for reference.

4. **Mock data**: Currently using static data from `lib/mock-data.ts`. Replace with PocketBase API calls once backend is deployed.

## Testing Checklist

Before committing significant changes:
- [ ] Test in both light and dark themes
- [ ] Test on mobile viewport (375px)
- [ ] Test offline functionality (disable network in DevTools)
- [ ] Verify favorites sync (local storage working)
- [ ] Check map markers render correctly
- [ ] Ensure bottom navigation doesn't overlap content

## Future Work

See `todo.txt` and `PHASE_6_SUMMARY.md` for detailed task lists. High-priority items:
- PocketBase deployment and integration
- Authentication system (login/register)
- Bazaar submission form with photo upload
- Reviews and ratings system
- PWA manifest and service workers
- Admin dashboard for approvals
