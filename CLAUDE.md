# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bazaar Ramadan Directory - A Progressive Web App (PWA) for discovering Ramadan bazaars across Malaysia. This is a community-driven platform with offline-first capabilities, built with Next.js and PocketBase.

**Current Status**: Phase 7 complete - PocketBase backend integrated! Core UI, favorites system, profile/settings pages, and live data from PocketBase all working.

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

# Initialize PocketBase schema (run once)
pnpm run init-pb
```

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5.7
- **UI**: Tailwind CSS 3.4, shadcn/ui components, Lucide icons
- **Backend**: PocketBase (deployed at pb-bazar.muaz.app)
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
  - `types.ts` - TypeScript interfaces (camelCase, app-level types)
  - `pocketbase-types.ts` - PocketBase response types (snake_case) and transformations
  - `db.ts` - Dexie database schema (IndexedDB for offline)
  - `pocketbase.ts` - PocketBase client configuration
  - `favorites.ts` - Favorites management with cloud sync
  - `api/bazaars.ts` - Bazaar data API functions
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

**Data Flow (PocketBase Integration)**:

1. **API Layer**: `lib/api/bazaars.ts` fetches data from PocketBase
2. **Transformation**: `lib/pocketbase-types.ts` converts snake_case responses to camelCase app types
3. **Type Safety**: `lib/types.ts` defines app-level TypeScript interfaces (camelCase)
4. **Offline Cache**: Favorites stored in IndexedDB (`lib/db.ts`) with cloud sync
5. **Computed Fields**: `isOpen` and `reviewCount` calculated client-side during transformation

## Important Configuration

### Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
NEXT_PUBLIC_POCKETBASE_URL=https://pb-bazar.muaz.app
POCKETBASE_URL=https://pb-bazar.muaz.app
POCKETBASE_SU_EMAIL=your-admin@email.com
POCKETBASE_SU_PASSWORD=your-admin-password
```

**Note**: Admin credentials (`POCKETBASE_SU_*`) are only needed for running the schema initialization script (`pnpm run init-pb`). They are not used by the frontend application.

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
"use client";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components with ssr: false
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
```

**Important**: Always disable SSR for Leaflet components. Check `components/map/bazaar-map.tsx` for reference implementation.

## Database Schema (Dexie/IndexedDB)

Defined in `lib/db.ts`:

- **favorites**: Stores favorite bazaar IDs with sync status
- **cachedBazaars**: Stores full bazaar data for offline access

**Never modify the schema version without migration plan**. Dexie auto-upgrades but data loss can occur.

## PocketBase Collections (Live)

Backend deployed at `https://pb-bazar.muaz.app`. Collections created and populated:

- **food_types**: 15 food categories (nasi-lemak, satay, murtabak, etc.)
  - Fields: `name`, `slug`, `icon`, `color_class`
  - All public read access

- **bazaars**: 8 bazaars imported from mock data
  - Fields: `name`, `description`, `lat`, `lng`, `address`, `district`, `state`, `stall_count`, `food_types` (relation), `open_hours` (JSON), `photos`, `status`, `submitted_by` (relation), `avg_rating`
  - Public can view approved bazaars
  - Authenticated users can submit new bazaars

- **reviews**: User reviews with ratings
  - Fields: `bazaar` (relation), `user` (relation), `rating` (1-5), `comment`, `photos`
  - Public read, authenticated write

- **favorites**: User favorites with cloud sync
  - Fields: `user` (relation), `bazaar` (relation)
  - Private to each user

**Type Transformation Layer** (`lib/pocketbase-types.ts`):

- Converts PocketBase snake_case responses → camelCase app types
- Functions: `transformBazaar()`, `transformReview()`, `calculateIsOpen()`
- Handles relation expansion (food_types, reviews, users)
- Computes derived fields (isOpen, reviewCount)

**API Functions** (`lib/api/bazaars.ts`):

- `getAllBazaars()` - Fetch all approved bazaars
- `getBazaarById(id)` - Fetch single bazaar with reviews
- `searchBazaars(query)` - Full-text search
- `filterBazaars(options)` - Filter by food types, rating, open status
- `getBazaarsByIds(ids)` - Batch fetch for favorites

**Schema Updates**: See `PRD.md` for future collections (reports, etc.)
