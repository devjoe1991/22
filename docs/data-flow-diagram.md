{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Bold;\f1\froman\fcharset0 Times-Roman;\f2\fmodern\fcharset0 Courier;
\f3\froman\fcharset0 Times-Italic;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
{\*\listtable{\list\listtemplateid1\listhybrid{\listlevel\levelnfc0\levelnfcn0\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{decimal\}}{\leveltext\leveltemplateid1\'01\'00;}{\levelnumbers\'01;}\fi-360\li720\lin720 }{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{circle\}}{\leveltext\leveltemplateid2\'01\uc0\u9702 ;}{\levelnumbers;}\fi-360\li1440\lin1440 }{\listname ;}\listid1}}
{\*\listoverridetable{\listoverride\listid1\listoverridecount0\ls1}}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\sa321\partightenfactor0

\f0\b\fs48 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Detailed Data Flow Diagram: Creating a New Character\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 This diagram illustrates the specific sequence and flow of data when a user creates a new character record and uploads an associated asset file.\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 Note:
\f1\b0  This diagram has been updated to fix a potential rendering issue by explicitly connecting the client and server components.\
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 graph TD\
    %% Define Nodes and Subgraphs\
\
    subgraph User Interaction\
        A[User fills out Character Form] --> B\{Submit Form\};\
        B --> C[Client-side validation passes];\
    end\
\
    subgraph Browser (Next.js Client)\
        D[API call to `/api/characters/create` with form data];\
        E\{Handle API Response\};\
        J[Use Signed URL to upload file directly to Storage] --> K[Update UI with new Character & Asset];\
    end\
\
    subgraph Vercel (Next.js Server)\
        F[API Route `/api/characters/create`];\
        G[Validate user session & permissions];\
        H[INSERT new record into 'characters' table];\
        I[Generate a Signed Upload URL for Supabase Storage];\
    end\
\
    subgraph Supabase\
        L(Supabase Auth);\
        M(PostgreSQL DB);\
        N(Supabase Storage);\
    end\
\
    %% Define Connections\
    C --> D;\
    D --> F; %% This connects the Client to the Server\
    F --> G;\
    G --> H;\
    H --> I;\
    I --> E; %% Server responds to Client\
    \
    E -- Success --> J;\
    E -- Error --> O[Show error message to user];\
\
    G --> L;\
    H --> M;\
    J --> N;\
\
    %% Define Styles\
    style A fill:#f9f,stroke:#333,stroke-width:2px\
    style D fill:#bbf,stroke:#333,stroke-width:2px\
    style F fill:#bbf,stroke:#333,stroke-width:2px\
    style N fill:#cfc,stroke:#333,stroke-width:2px\
    style M fill:#ccf,stroke:#333,stroke-width:2px\
\
\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 Data Flow Steps:\
\pard\tx220\tx720\pardeftab720\li720\fi-720\sa240\partightenfactor0
\ls1\ilvl0
\fs24 \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	1	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 User Action:
\f1\b0  An authorized user fills in the details for a new character (name, description, etc.) and selects a 3D model file to upload.\
\ls1\ilvl0
\f0\b \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	2	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Client-Side:
\f1\b0  The browser runs initial validation on the form. On submission, it makes an API call to the Next.js backend, sending the character's text-based data.\
\ls1\ilvl0
\f0\b \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	3	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Server-Side Logic (Vercel):
\f1\b0 \
\pard\tx940\tx1440\pardeftab720\li1440\fi-1440\sa240\partightenfactor0
\ls1\ilvl1\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 The API route receives the request.\
\ls1\ilvl1\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 It first validates the user's session token with Supabase Auth to ensure they have the correct permissions (e.g., 'Admin' or 'Editor').\
\ls1\ilvl1\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 If authorized, it inserts the new character's data into the PostgreSQL database.\
\ls1\ilvl1\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 It then asks Supabase Storage to generate a special, secure, time-limited "signed URL" that grants permission for a single file upload.\
\ls1\ilvl1\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 The server sends a success response back to the client, including the data for the newly created character and the signed URL.\
\pard\tx220\tx720\pardeftab720\li720\fi-720\sa240\partightenfactor0
\ls1\ilvl0
\f0\b \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	4	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Client-Side (Continued):
\f1\b0 \
\pard\tx940\tx1440\pardeftab720\li1440\fi-1440\sa240\partightenfactor0
\ls1\ilvl1\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 The browser receives the successful response.\
\ls1\ilvl1\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 It then uses this signed URL to upload the 3D model file 
\f3\i directly
\f1\i0  to Supabase Storage. This is efficient as the large file doesn't need to pass through the Vercel server.\
\ls1\ilvl1\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Once the upload to storage is complete, the UI updates to show the new character in the directory and their 3D model in their asset gallery.\
}