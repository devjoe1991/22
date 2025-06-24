Memory Bank & Core Concepts for "The Rebirth H22"
1. Core Data Models
User: Represents an authenticated individual. Handled by Supabase Auth.

Profile: Public-facing user data. Linked one-to-one with a User.

id (UUID, FK to auth.users)

username (text)

avatar_url (text)

role (enum: 'admin', 'editor', 'viewer', 'moderator')

Character: A central entity in the project.

id (UUID)

name (text)

description (text)

status (enum: 'idea', 'in-progress', 'completed')

thumbnail_url (text)

filter_tags (JSONB, stores categorized tags for filtering)
  - physical_attributes: string[]
  - cosmetic_symbology: string[]
  - animal_form: string[]

Asset: A file linked to another entity.

id (UUID)

parent_id (UUID, links to a character, scene, etc.)

parent_type (enum: 'character', 'scene')

file_url (text)

file_type (text)

uploader_id (UUID, FK to auth.users)

Audit Log: Tracks user actions.

id (UUID)

user_id (UUID, FK to auth.users)

action_type (text, e.g., 'character.create')

details (JSONB)

created_at (timestamp)

2. Key Decisions
Real-time Strategy: We will use Supabase's built-in Realtime subscriptions for live updates on comments and activity feeds. For collaborative editing (Tiptap, React Flow), we will broadcast changes via Supabase Realtime and rely on application-level state management to resolve conflicts (last-write-wins).

File Naming Convention: All uploaded files will be stored in Supabase Storage with a path structure of /{parent_type}/{parent_id}/{uuid}_{original_filename} to prevent name collisions and organize assets logically.

Color Coding: User colors for the audit trail will be generated client-side based on a hash of the user's ID to ensure consistency across sessions. The color palette will be predefined to ensure good contrast and aesthetics.

3. Core UI/UX Principles
Confidence through Feedback: Every action (especially saving) must provide immediate visual feedback to the user (e.g., a "Saved" toast notification).

Context is King: The UI should always make it clear what project entity is being viewed or edited. Breadcrumbs and clear headings are mandatory.

Minimize Clicks: Key actions should be easily accessible. For example, uploading a new file to a character should be possible directly from the character's detail page.