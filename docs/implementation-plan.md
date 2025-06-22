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

### **Phase 4: Interactive Editors & Advanced Features (Weeks 5-6)**

- [x] **4.1: Build the Visual Workflow Editor**
  - **Action:** Implement a node-based editor using `React Flow` for creating and managing narrative or process workflows.
  - **Page:** `/workflows` and `/workflows/[id]`
  - **Components:** `WorkflowCanvas.tsx`, `CustomNode.tsx`
  - **Notes:** Built the visual workflow editor using `React Flow`. Created a `workflows` table in Supabase. Implemented `WorkflowCanvas` client component, custom nodes, and a server action to save state. Added pages to list and view individual workflows. Integrated the feature into the main navigation.

- [x] **4.2: Develop the Rich Text Editor**
  - **Action:** Integrate `Tiptap` to create a rich text editor for writing scene details, character bios, or chapter content.
  - **Component:** `TextEditor.tsx`
  - **Notes:** Implemented a rich text editor using `Tiptap`. Created a reusable `TiptapEditor` component with a formatting toolbar. Added a `story_content` JSONB column to the `characters` table. Implemented an auto-saving mechanism with a 2-second debounce, providing users with real-time feedback. Integrated the editor into the character detail page.

- [x] **4.3: Implement Real-time Functionality**
  - **Action:** Use Supabase Realtime to enable real-time features, starting with the comment section.
  - **Component:** `CommentSection.tsx`
  - **Notes:** Implemented real-time functionality in the `CommentSection`. The component now subscribes to database changes and displays new comments instantly without a page refresh. Added RLS policies for comment security and a server action for comment creation. A temporary type cast was used to overcome a persistent issue with Supabase type generation.

- [x] **4.4: Create Audit Trail & Color Coding**
  - **Action:** Create a system to log significant user actions and display them in a real-time activity feed with color-coding for each user.
  - **Components:** `ActivityFeed.tsx`
  - **Utilities:** `logAction`, `getUserColor`
  - **Notes:** Implemented the audit trail system. Created a generic `logAction` server function. Integrated logging into existing character actions. Built a real-time `ActivityFeed` component that subscribes to new log entries. Implemented a color-coding utility to visually distinguish user actions.

- [x] **4.5: Advanced Workflow & State Management**
  - **Action:** Enhance the workflow editor with more complex node types and state management using Zustand.
  - **Notes:** Refactored the workflow canvas to use a new Zustand store (`src/lib/store/workflow-store.ts`) for state management. Introduced a new custom `CharacterNode` (`src/components/workflows/CharacterNode.tsx`) and updated `WorkflowCanvas.tsx` to integrate these changes.

- [ ] **4.5.1: Implement Scenes & Chapters with Tagging**
  - **Action:** Build out the core `scenes` and `chapters` sections. Implement a many-to-many "tagging" system to link characters to scenes.
  - **Notes:** Updated the database schema, adding `scenes`, `chapters`, and association tables (`character_scenes`, `scene_chapters`). Created server actions (`src/app/actions/scenes-actions.ts`) to manage data. Built directory and detail pages (`/scenes` and `/scenes/[id]`) with a tagging UI to link characters. Updated the main sidebar navigation.

- [ ] **4.6: Notifications System**
  - **Action:** Develop a real-time notification system to alert users of important events, such as new comments on their content or mentions.
  - **Notes:**

- [ ] **4.7: User Roles & Permissions**
  - **Action:** Refine and test the RBAC system to ensure all user roles function as expected.
  - **Notes:**

- [ ] **4.8: Search & Filtering**
  - **Action:** Implement advanced search and filtering capabilities in the main directories.
  - **Notes:**

- [ ] **4.9: Deployment & Finalization**
  - **Action:** Prepare the application for deployment. This includes optimizing performance, running tests, and creating a production build.
  - **Notes:**