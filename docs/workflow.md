# User Workflow Diagram: Uploading a New Character Asset
---

This diagram shows the sequence of events when an "Editor" user uploads a new 3D model for an existing character.

```mermaid
sequenceDiagram
    participant User as Editor User
    participant Frontend as Next.js App (Client)
    participant Backend as Next.js (Server)
    participant Storage as Supabase Storage
    participant DB as Supabase DB

    User->>Frontend: Drags new .glb file onto Character Detail page
    Frontend->>Frontend: Displays upload progress UI
    Frontend->>Storage: Uploads file directly with unique name
    Storage-->>Frontend: Returns public URL of the uploaded file

    alt Upload Successful
        Frontend->>Backend: API POST: /api/assets/create
        Note right of Frontend: Payload includes:<br/>- Character ID<br/>- File URL<br/>- File Name<br/>- File Type
        Backend->>DB: INSERT into 'assets' table
        DB->>DB: Check RLS Policy (Is user an Editor?)
        DB-->>Backend: Confirms insertion
        Backend-->>Frontend: Returns new asset data (success)
        Frontend->>Frontend: Updates UI to show new model in gallery
        DB->>Frontend: (via Realtime) Pushes update to other connected users
    else Upload Failed
        Storage-->>Frontend: Returns error
        Frontend->>User: Shows error message
    end

