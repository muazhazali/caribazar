This PocketBase schema defines a **Bazaar Discovery & Review** application, likely tailored for the Malaysian context (given the states listed). It consists of six main collections: `users`, `bazaars`, `food_types`, `reviews`, `favorites`, and `reports`.

---

## 🛠 Collection Overview

| Collection       | Type | Purpose                                                 |
| ---------------- | ---- | ------------------------------------------------------- |
| **`users`**      | Auth | Handles user authentication, profiles, and avatars.     |
| **`bazaars`**    | Base | Stores bazaar locations, metadata, and status.          |
| **`food_types`** | Base | A lookup table for categories (e.g., Satay, Beverages). |
| **`reviews`**    | Base | Stores user-generated ratings and comments for bazaars. |
| **`favorites`**  | Base | Stores user favorites/bookmarks for bazaars.            |
| **`reports`**    | Base | Stores user reports for moderation and data quality.    |

---

## 📋 Detailed Schema

### 1. `users` (Auth Collection)

Manages the platform's users.

- **Fields:**
- `username`: Text (Username)
- `email`: Email (Required, Unique)
- `role`: Select (`user`, `mod`, `admin`) for access control
- `avatar`: File (Profile image)

- **Permissions:** Users can view and update only their own records (`id = @request.auth.id`).

### 2. `bazaars` (Base Collection)

The core data for bazaar locations.

- **Core Info:** `name` (Required), `description`, `address`, `district`, `stall_count`.
- **Geography:** `lat` (Latitude), `lng` (Longitude), `state` (Dropdown of Malaysian states).
- **Metadata:**
- `food_types`: Relation (M-M) to the `food_types` collection.
- `status`: Select (`pending`, `approved`, `rejected`) for moderation.
- `open_hours`: JSON field for flexible scheduling.
- `avg_rating`: Number for quick sorting/display.
- `photos`: Multi-file upload (up to 99 images).
- `submitted_by`: Relation to `users` (Tracks who submitted the bazaar).

- **Permissions:** Publicly viewable; creation requires an authenticated user.

### 3. `food_types` (Base Collection)

Categories used to tag bazaars.

- **Fields:** `name`, `slug` (URL friendly), `icon` (Likely a CSS class or emoji), and `color_class`.
- **Permissions:** Publicly viewable.

### 4. `reviews` (Base Collection)

User feedback loop.

- **Fields:**
- `bazaar`: Relation (Links to the bazaar being reviewed).
- `user`: Relation (Links to the reviewer).
- `rating`: Number (Min: 1, Max: 5).
- `comment`: Text.
- `photos`: Multi-file upload (Review images).

- **Permissions:** Publicly viewable; users can only update or delete their own reviews.

### 5. `favorites` (Base Collection)

User bookmarks/favorites for quick access.

- **Fields:**
- `user`: Relation (Links to the user).
- `bazaar`: Relation (Links to the favorited bazaar).

- **Permissions:** Users can only view, create, and delete their own favorites (`user = @request.auth.id`).

### 6. `reports` (Base Collection)

User-generated reports for data quality and moderation.

- **Fields:**
- `bazaar`: Relation (Links to the reported bazaar).
- `reason`: Text (Reason for report).
- `details`: Text (Additional details).
- `status`: Select (`pending`, `resolved`, `dismissed`) for moderation tracking.

- **Permissions:** Authenticated users can create reports; only admins/mods can view and update.

---

## 🔗 Relationships

- **Many-to-Many:** `bazaars` ↔ `food_types` (via `food_types` relation field).
- **One-to-Many:** `bazaars` ↔ `reviews` (One bazaar has many reviews).
- **One-to-Many:** `users` ↔ `reviews` (One user can write many reviews).
- **One-to-Many:** `users` ↔ `favorites` (One user can have many favorites).
- **One-to-Many:** `bazaars` ↔ `favorites` (One bazaar can be favorited by many users).
- **One-to-Many:** `bazaars` ↔ `reports` (One bazaar can have many reports).
- **One-to-Many:** `users` ↔ `bazaars` (via `submitted_by` - One user can submit many bazaars).
