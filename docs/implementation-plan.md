# Enhanced Implementation Plan: The Rebirth H22
---

**Objective:** This document provides a granular, step-by-step guide for Cursor AI to build the "The Rebirth H22" application. Each major phase is broken down into specific, actionable tasks.

**Instructions for Cursor:**
- Read and fully understand the `prd.md`, `architecture.md`, and `tech_stack.md` before starting.
- Execute the tasks in the specified order.
- After completing a task, mark the corresponding checkbox (`- [x]`).
- Add brief implementation notes under the completed task, mentioning any key files created or decisions made.
- If you encounter an issue, reference the problem and your proposed solution in the notes.

---

### **Phase 1: Project Setup & Foundation (Week 1)**

- [ ] **1.1: Initialize Next.js Project**
  - **Action:** Create a new Next.js 14+ project with the App Router.
  - **Command:** `npx create-next-app@latest the-rebirth-h22`
  - **Configuration:** Select TypeScript, ESLint, Tailwind CSS, and `src/` directory.
  - **Notes:**

- [x] **1.2: Setup Supabase Project**
  - **Action:** Guide the user to create a new project on `supabase.com`.
  - **Action:** Store the Project URL and `anon` key securely in a `.env.local` file.
  - **File:** `/.env.local`
  - **Content:**
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
  - **Notes:** Created `.env.local` with user-provided Supabase credentials.

- [x] **1.3: Configure Supabase Client**
  - **Action:** Create a utility file to initialize the Supabase client for use throughout the application (both client and server-side).
  - **File:** `/src/lib/supabase/client.ts`
  - **Notes:** Created Supabase client at `/src/lib/supabase/client.ts` and placeholder types at `/src/lib/types/supabase.ts`.

- [x] **1.4: Install Core Dependencies**
  - **Action:** Install all necessary libraries as defined in `tech_stack.md`.
  - **Command:**
    ```bash
    npm install @supabase/ssr @supabase/supabase-js
    npm install zustand jotai
    npm install lucide-react
    npm install react-hook-form
    npm install dnd-kit
    npm install @tiptap/react @tiptap/starter-kit
    npm install reactflow
    npm install @react-three/fiber @react-three/drei three
    npm install -D @types/three
    ```
  - **Notes:** Installed all core project dependencies via npm.

- [x] **1.5: Setup Shadcn/UI**
  - **Action:** Initialize Shadcn/UI in the project.
  - **Command:** `npx shadcn-ui@latest init`
  - **Configuration:** Follow the prompts to configure `tailwind.config.ts` and `globals.css`.
  - **Notes:** Initialized Shadcn/UI with Slate theme and CSS variables. Component alias configured to `@/components`.

- [x] **1.6: Define Database Schema**
  - **Action:** Create the initial database tables in the Supabase SQL Editor based on `memory_bank.md`.
  - **Tables:** `users`, `profiles`, `projects`, `characters`, `scenes`, `chapters`, `assets`, `tags`, `audit_log`, `comments`.
  - **Action:** Enable Row Level Security (RLS) on all tables.
  - **Notes:** Executed SQL script in Supabase to create all initial tables (`profiles`, `characters`, `scenes`, etc.), custom types, and enabled RLS on all tables.

---

### **Phase 2: Authentication & User Management (Week 2)**

- [x] **2.1: Implement User Authentication**
  - **Action:** Create sign-up, login, and logout functionality using Supabase Auth.
  - **Components:** `SignUpForm.tsx`, `LoginForm.tsx`, `AuthButton.tsx` (shows login or user avatar with logout).
  - **Pages:** `/login`, `/signup`.
  - **Notes:** Implemented full authentication flow. Generated DB types. Created server/middleware Supabase clients. Built login/signup pages using Server Actions. Added middleware for protected routes. Added `AuthButton` to the main layout for login/logout.

- [x] **2.2: Create User Profile Page**
  - **Action:** Build a page where users can view and update their profile information (display name, avatar).
  - **Page:** `/account`
  - **Notes:** Created user account page at `/account` with a form to update username and avatar URL. Implemented the `updateProfile` server action.

- [x] **2.3: Implement Role-Based Access Control (RBAC)**
  - **Action:** Write RLS policies in Supabase SQL to enforce the permissions defined in `prd.md`.
  - **Action:** Create a context or hook (`useUserRole`) in the frontend to easily check the current user's role and conditionally render UI elements.
  - **Notes:** Executed SQL script in Supabase to add RLS policies. Created `handle_new_user` trigger to auto-create profiles. Added policies for profiles (select/update own) and characters (select/insert/update/delete based on user role).

---

### **Phase 3: Core Directory Features (Weeks 3-4)**

- [x] **3.1: Build Main Dashboard Layout**
  - **Action:** Create the main application shell with a sidebar for navigation and a main content area.
  - **Components:** `Sidebar.tsx`, `Header.tsx`, `PageWrapper.tsx`.
  - **Notes:** Built the main app layout using a persistent sidebar and header. Implemented route groups `(app)` and `(auth)` to separate protected and public layouts. `auth-button.tsx` was relocated. Layout is responsive with a sheet-based menu for mobile.

- [x] **3.2: Create the Directory View**
  - **Action:** Develop the main page for browsing characters. Fetch data from Supabase.
  - **Page:** `/characters`
  - **Components:** `CharacterCard.tsx`, `FilterControls.tsx`.
  - **Notes:** Built the main characters directory page at `/characters`. Created a reusable `CharacterCard` component. The page fetches all characters from Supabase and displays them in a grid. Added a placeholder page for character creation.

- [x] **3.3: Implement Character Detail Page**
  - **Action:** Create the dynamic page for viewing a single character.
  - **Page:** `/characters/[id]`
  - **Components:** `AssetGallery.tsx`, `CommentSection.tsx`, `ActivityFeed.tsx`.
  - **Notes:** Created the dynamic character detail page at `/characters/[id]`. The page fetches a single character's data. Added placeholder components `AssetGallery`, `CommentSection`, and `ActivityFeed` for page structure.

- [x] **3.4: Implement File Uploads**
  - **Action:** Integrate `dnd-kit` for drag-and-drop file uploads to Supabase Storage.
  - **Component:** `FileUpload.tsx`
  - **Logic:** Link uploaded files to the corresponding character in the `assets` table.
  - **Notes:** Implemented file uploads using `react-dropzone`. Created a `FileUpload` client component and a `createAsset` server action. The system uses signed URLs for secure, direct uploads to Supabase Storage. Integrated a `Toaster` for user feedback. Replaced dummy data in `AssetGallery` with real, fetched assets. Added required storage bucket policies.

- [x] **3.5: Implement 3D Model Viewer**
  - **Action:** Use `@react-three/fiber` and `@react-three/drei` to create a component that can load and display `.gltf` or `.glb` models.
  - **Component:** `ModelViewer.tsx`
  - **Notes:** Implemented the `ModelViewer` component using `react-three-fiber` and `drei`. It supports loading `.glb` models, includes orbit controls for interaction, and has a default stage environment. Integrated it into the `AssetGallery`.

---

### **Phase 4: Dual Tagging System: Attributes & Color Keys (Current)**

This phase implements two distinct, coexisting systems for categorizing content: character-specific attributes and global, thematic Color Keys.

- **[X] Database Schema for Dual Systems**
  - **[X]** Add `attribute_tags` JSONB column to `characters` table.
  - **[X]** Create `color_keys` table for global, color-coded tags.
  - **[X]** Create `entity_color_keys` association table.
  - **[X]** Clean up obsolete `tags` and `entity_tags` tables.

- **[X] Global "Color Key" Feature**
  - **[X]** Add top-level "Color Keys" link to the main sidebar.
  - **[X]** Build the Color Key management list page (`/color-keys`).
  - **[X]** Build the Color Key discovery/detail page (`/color-keys/[id]`).
  - **[X]** Integrate a Color Key quick-access panel into the main dashboard.
  
- **[X] Character Page Dual System UI**
  - **[X]** Create `AttributeTagManager` component for character-specific tags.
  - **[X]** Create `updateCharacterAttributeTags` server action.
  - **[X]** Refactor old `TagManager` into `ColorKeyManager`.
  - **[X]** Update Character Detail Page to use both managers.

---

### **Phase 5: Admin Notes & Assignment System (Current)**

This phase implements a system for Admins to create notes, pin them for themselves, and assign them to the dashboards of other users.

- **[X] Database Schema for Notes**
  - **[X]** Create `notes` table for note content and global pin status.
  - **[X]** Create `note_assignments` table to link notes to specific users.

- **[X] Notes Management Page**
  - **[X]** Add a new admin-only "Notes" link to the main sidebar.
  - **[X]** Create server actions for all note operations (`create`, `delete`, `pin`, `assign`).
  - **[X]** Build a comprehensive client component (`NotesClient`) to manage the UI.
  - **[X]** Create the main `/notes` page to host the client component and fetch data.
  
- **[X] Dashboard Integration**
  - **[X]** Update dashboard data fetching to pull all notes relevant to the current user.
  - **[X]** Create a "Pinned Notes" section on the dashboard to display them.

---

### **Phase 6: Professional Overhaul & Admin Tooling (Week 8)**

- [x] **6.1: Professional Theming & UI Polish**
  - **Action:** Overhauled the application's visual theme and improved the UI/UX.
  - **Notes:**
    - Changed the application theme to `slate` in `globals.css` for a more professional, dark-mode-first aesthetic.
    - Added a live UK date/time display (`src/components/layout/LiveDateTime.tsx`) to the main header for improved context.
    - Refactored the main app layout for more elegant content padding and width constraints.

- [x] **6.2: Admin Inline Editing**
  - **Action:** Empowered admins with the ability to edit content directly on the page.
  - **Notes:**
    - Created a reusable `EditableField.tsx` component for inline editing of titles.
    - Implemented a generic `updateItemName` server action in `general-actions.ts` to handle updates for multiple tables.
    - Integrated the editable field into the Scene detail page, allowing admins to change scene names without navigating away.
    - Refactored the scene detail page into a Server Component with a child Client Component to support both server-side data fetching and client-side interactivity.

- [x] **6.3: Versatile Admin Dashboard**
  - **Action:** Rebuilt the dashboard to be a more effective and informative hub.
  - **Notes:**
    - Updated middleware to robustly redirect authenticated users to `/dashboard`.
    - Redesigned the dashboard UI with a new welcome header and project vision card.
    - Enhanced the "Recent Activity" feed to be more detailed, including links to the modified items.
    - Updated the `logAction` function and all its call sites to ensure `item_id`, `item_type`, and `item_name` are always included for generating activity links.

- [x] **6.4: Advanced Character Tagging System**
  - **Action:** Implemented a flexible, multi-category tagging system for characters.
  - **Notes:**
    - Added a `filter_tags` JSONB column to the `characters` table via a new migration.
    - Created a `TagManager.tsx` component for admins to add and remove tags on the character detail page.
    - Implemented an `updateCharacterTags` server action to handle the JSONB updates.
    - Overhauled the `FilterControls.tsx` component, replacing the old filters with new, multi-select dropdowns for each tag category (`physical_attributes`, `cosmetic_symbology`, `animal_form`).
    - Updated the character directory page to filter characters based on the new tag system.

---

### **Phase 7: Global, Color-Coded Tagging System (Current)**

This phase introduces a new, centralized system for creating, managing, and applying color-coded tags (called "Key Elements") to any core entity (Character, Scene, Chapter). This replaces the previous, more limited tagging implementations.

- **[X] Database Schema for Global Tags:**
    - **[X]** Created a new migration (`20240525000000_create_global_tag_system.sql`).
    - **[X]** Added `tags` table for storing global, color-coded tags.
    - **[X]** Added `entity_tags` polymorphic association table to link tags to characters, scenes, or chapters.
    - **[X]** Implemented the `get_my_role()` SQL helper function for RLS policies.
    - **[X]** Defined and applied all necessary Row Level Security policies for `tags` and `entity_tags`.
    - **[X]** Created `get_tags_for_entity` SQL function to bypass type generation issues.

- **[X] Admin UI for Tag Management:**
    - **[X]** Created a new settings page at `/app/(app)/settings/tags/page.tsx`.
    - **[X]** Built a dedicated client component (`CreateTagForm.tsx`) to handle form state and interactivity.
    - **[X]** Implemented the `createTag` server action in `/app/actions/tags-actions.ts` to allow admins to create new tags.
    - **[X]** The page lists all existing tags with their corresponding color.

- **[X] Tagging UI on Detail Pages:**
    - **[X]** Created a new reusable component `src/components/tags/TagManager.tsx`.
    - **[X]** The `TagManager` displays an entity's applied tags as colored badges.
    - **[X]** Integrated the `TagManager` into the character detail page (`/app/(app)/characters/[id]/page.tsx`).
    - **[X]** Data fetching on the character page was updated to retrieve all available tags and the specific tags applied to that character.

### Next Steps
- Implement the "add" and "remove" tag functionality within the `TagManager` component.
- Roll out the `TagManager` component to Scene and Chapter detail pages.
- Generate updated Supabase types to remove the need for `@ts-ignore` and `(supabase as any)` workarounds.