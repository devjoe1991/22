Architecture Diagram for "The Rebirth H22"
This diagram illustrates the high-level system architecture, showing the flow of data and interactions between different components.

Note: This diagram has been updated with a more robust structure to ensure it renders correctly.

graph TD
    %% === Define All Nodes First ===
    A[User's Browser]
    
    %% Vercel Nodes
    B1[Next.js Frontend]
    B2[Next.js API Routes / Server Components]
    
    %% Supabase Nodes
    C[PostgreSQL Database]
    D[Storage (S3)]
    E[Auth]
    F[Edge Functions]
    G[Realtime Engine]

    %% === Define All Connections ===
    A -->|HTTPS| B1
    A -->|Direct Upload (Optional)| D
    
    B1 -->|Interactive UI| A
    B1 -->|API Calls| B2
    
    B2 -->|Data Queries / Mutations| C
    B2 -->|File Operations| D
    B2 -->|Auth Checks| E
    B2 -->|Server-Side Logic| A
    
    C -->|RLS Policies| E
    C -->|Database Webhooks| G
    
    G -->|Real-time Updates (Websockets)| A

    %% === Group Nodes into Subgraphs ===
    subgraph Vercel
        direction LR
        B1 --- B2
    end
    
    subgraph Supabase Platform
        direction LR
        C --- D --- E --- F --- G
    end

    %% === Apply Styles ===
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style Vercel fill:#e6e6ff,stroke:#333,stroke-width:2px,color:#000
    style Supabase Platform fill:#d4f3d4,stroke:#333,stroke-width:2px,color:#000

Component Breakdown:
User's Browser: The client device where the user interacts with the application.

Vercel: The hosting platform for our Next.js application.

Next.js Frontend: The React components, styling (Tailwind CSS), and client-side logic that runs in the user's browser.

Next.js API Routes / Server Components: The server-side logic responsible for secure data fetching, mutations, and rendering.

Supabase Platform: Our all-in-one backend-as-a-service.

PostgreSQL Database: The core relational database storing all structured data.

Storage: Manages large file assets like 3D models and images.

Auth: Handles user authentication and authorization, integrated with database RLS.

Edge Functions: For any custom server-side logic that needs to be globally distributed.

Realtime Engine: Pushes live updates to the client via WebSockets.