Product Requirements Document (PRD) for "The Rebirth H22"
1. Overview
"The Rebirth H22" is a bespoke, web-based project management and digital asset directory portal. It is designed specifically for the collaborative creation of a large-scale, immersive cinematic VR world. The platform will serve as the central hub for the entire creative team, enabling seamless collaboration, asset management, and project planning from conception to completion. The user experience will be highly visual, interactive, and intuitive, on par with leading industry tools.

2. Project Goals & Objectives
Centralize All Project Assets: To create a single source of truth for all creative and planning materials, including 3D models, concept art, scripts, storyboards, business plans, and more.

Streamline Collaborative Workflows: To enable real-time collaboration between team members with different roles and permissions, reducing friction and communication overhead.

Enhance Project Visualization: To provide powerful tools for visualizing project structure, character relationships, scene transitions, and overall progress.

Ensure Data Integrity and Security: To implement automatic saving, version history, and a robust permissions system to protect the project's data.

3. Target Audience & User Roles
The platform is designed for a small, dedicated creative team.

Admin (You & your friend):

Full control over the entire project.

Can manage user accounts and assign roles.

Can create, edit, and delete all project data (characters, scenes, chapters, etc.).

Can manage project settings and billing.

Editor:

Can create and upload new assets (files, notes).

Can edit existing assets and their metadata.

Can participate in comments and discussions.

Cannot manage users or delete core project structures like chapters or characters (only the assets within them).

Viewer:

Read-only access to the project.

Can view all characters, scenes, and associated files.

Can leave comments or feedback on items.

Cannot create, edit, or delete any content.

Moderator:

Can manage comments and discussions.

Can organize and tag content.

Has permissions similar to an Editor but with a focus on content organization rather than creation.

4. Features & Functionality
4.1 Core Features
Dashboard: A personalized landing page showing recent activity, assigned tasks, and a project overview.

Directory: The central hub for browsing all project entities: Characters, Scenes, Chapters, Locations, etc.

Grid-based and list-based views.

Advanced filtering and sorting based on tags, status, creation date, etc.

Detail View: A dedicated page for each entity (e.g., a character).

Displays all associated information and files.

Interactive 3D model viewer for character models.

Comment threads for discussion.

Activity log showing a history of changes.

File Management:

Drag-and-drop file uploads.

Support for various file types (.blend, .fbx, .gltf, .jpg, .png, .mp4, .pdf, .docx).

Automatic thumbnail generation for images and videos.

User Management:

Secure account creation and login (email/password & social logins).

Role-based access control (RBAC).

4.2 Advanced Features
Workflow Builder: A node-based visual editor (using React Flow) to map out:

Story narratives and branching paths.

Scene transitions.

Character development arcs.

Mood Boards: Create and share visual mood boards using images, notes, and color palettes.

Rich Text Editor: A Tiptap-based editor for detailed documents like scripts, business plans, and character backstories. Supports collaborative editing.

Real-time Collaboration:

Automatic saving for all actions.

Real-time updates across all connected clients (e.g., a new file appears instantly).

User presence indicators (avatars showing who is currently viewing a page).

Audit Trail:

Every significant action (upload, edit, comment) is logged.

User actions are color-coded for easy identification in activity feeds.

5. Non-Functional Requirements
Performance: The application must be fast and responsive, with initial page loads under 2 seconds.

Scalability: The architecture must handle a growing number of assets and users without degradation in performance.

Security: All data must be encrypted in transit and at rest. User authentication must be secure.

Usability: The UI must be intuitive and require minimal training for new users.

Responsiveness: The layout must adapt gracefully to various screen sizes, from mobile to large desktop monitors.

6. Success Metrics
Adoption: The entire team actively uses the portal as their primary tool for collaboration.

Efficiency: A measurable reduction in time spent searching for assets or clarifying project status.

User Satisfaction: Positive feedback from the team on the platform's ease of use and feature set.