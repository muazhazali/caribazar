This version is optimized for LLM context windows, focusing on **data structures, logic, and technical constraints** while stripping away the fluff.

---

# LLM-Ready PRD: Bazaar Ramadan Directory (PWA)

## 1. Project Core

- **Goal**: Community-driven PWA for discovering Ramadan bazaars.
- **Key Focus**: Mobile-first, Offline-first (IndexedDB), and Interactive Maps (Leaflet/OSM).
- **Stack**: Next.js 14 (App Router), PocketBase (Backend/Auth), Tailwind + shadcn/ui, Dexie.js (Offline), next-pwa.

---

## 2. Technical Architecture

- **Backend**: PocketBase (Self-hosted on VPS). REST API + Real-time subscriptions.
- **Storage**: PocketBase (Files/Images), SQLite (Database).
- **Frontend**: Next.js 14 on Vercel.
- **Maps**: Leaflet.js with OpenStreetMap (Avoids Google Maps API costs).
- **PWA**: `next-pwa` (Workbox) for service workers.

---

## 3. Data Model (PocketBase Collections)

| Collection     | Fields                                                                                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **bazaars**    | `name`, `description`, `lat/lng`, `address`, `stall_count`, `food_types` (rel), `open_hours` (json), `photos` (files), `status` (pending/approved), `submitted_by` (rel), `avg_rating` |
| **food_types** | `name`, `slug`, `icon`                                                                                                                                                                 |
| **users**      | `username`, `email`, `role` (user/mod/admin), `avatar`                                                                                                                                 |
| **reviews**    | `bazaar` (rel), `user` (rel), `rating` (1-5), `comment`, `photos`                                                                                                                      |
| **favorites**  | `user` (rel), `bazaar` (rel)                                                                                                                                                           |
| **reports**    | `bazaar` (rel), `reason`, `details`, `status`                                                                                                                                          |

---

## 4. MVP Feature Set (2-3 Week Scope)

1. **Map Interface**: Cluster markers, geolocation, "Open Now" status.
2. **Submission**: Multi-step form with map picker and photo upload (Admin approval required).
3. **Details Page**: Hero images, directions (deep link), share button, reviews.
4. **Auth**: Email sign-up/login via PocketBase.
5. **Search/Filter**: Filter by food type, distance, and rating.
6. **Admin Panel**: Queue for approving/rejecting user submissions.

---

## 5. Offline & PWA Logic

- **Service Worker**:
- _Cache-First_: Assets/Images.
- _Network-First_: API data with IndexedDB fallback.

- **Offline Data (Dexie.js)**:
- Store `bazaars` and `favorites` locally.
- **Background Sync**: Queue reviews and new bazaar submissions while offline; sync via Service Worker `sync` event when connection returns.

- **Map Caching**: Cache OSM tiles for the user's active/saved areas.

---

## 6. Development Roadmap

### Phase 1: Foundation (Week 1)

- Deploy PocketBase. Setup schema and API permissions.
- Setup Next.js + Leaflet. Create Map view with mock data.
- Implement Auth (Login/Register).

### Phase 2: Core Features (Week 2)

- Build Bazaar Submission form (Zod validation).
- Implement Bazaar Details + Review system.
- Setup Search & Category filters.
- Admin Dashboard for listing approval.

### Phase 3: PWA & Polish (Week 3)

- Configure `next-pwa` and Manifest.
- Implement Dexie.js for offline persistence and Background Sync.
- Image optimization (WebP/Thumbnails).
- SEO (Meta tags/JSON-LD).

---

## 7. Success Metrics (Target)

- **Performance**: Lighthouse Score > 90.
- **PWA**: 100% PWA compliant.
- **Engagement**: 20% user contribution rate.

**Would you like me to generate the initial PocketBase schema initialization script or the Next.js directory structure for this project?**
