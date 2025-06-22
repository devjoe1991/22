{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Bold;\f1\froman\fcharset0 Times-Roman;\f2\fmodern\fcharset0 Courier;
\f3\fmodern\fcharset0 Courier-Bold;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
{\*\listtable{\list\listtemplateid1\listhybrid{\listlevel\levelnfc0\levelnfcn0\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{decimal\}}{\leveltext\leveltemplateid1\'01\'00;}{\levelnumbers\'01;}\fi-360\li720\lin720 }{\listlevel\levelnfc23\levelnfcn23\leveljc0\leveljcn0\levelfollow0\levelstartat1\levelspace360\levelindent0{\*\levelmarker \{circle\}}{\leveltext\leveltemplateid2\'01\uc0\u9702 ;}{\levelnumbers;}\fi-360\li1440\lin1440 }{\listname ;}\listid1}}
{\*\listoverridetable{\listoverride\listid1\listoverridecount0\ls1}}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\sa321\partightenfactor0

\f0\b\fs48 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Frontend Component Interaction Diagram: Character Detail Page\
\pard\pardeftab720\sa240\partightenfactor0

\f1\b0\fs24 \cf0 This diagram illustrates the hierarchy and data flow between the React components that make up the 
\f2\fs26 /characters/[id]
\f1\fs24  page.\
\pard\pardeftab720\sa240\partightenfactor0

\f0\b \cf0 Note:
\f1\b0  This diagram has been updated with a simplified and more explicit structure to ensure it renders correctly.\
\pard\pardeftab720\partightenfactor0

\f2\fs26 \cf0 graph TD\
    %% Define Parent Page\
    A(Page: /characters/[id]<br><i>Fetches all data, manages state</i>)\
\
    %% Define Main Content Components\
    D[CharacterHeader<br><i>props: characterData</i>]\
    E[AssetGallery<br><i>props: assetList, onUploadSuccess</i>]\
    F[CommentSection<br><i>props: commentList, onCommentSubmit</i>]\
\
    %% Define Nested Components\
    subgraph AssetGallery\
        E_H(AssetCard)\
        E_I(ModelViewer)\
        E_J(FileUpload<br><i>callback: onUploadSuccess</i>)\
    end\
    \
    subgraph CommentSection\
        F_K(CommentList)\
        F_L(CommentForm<br><i>callback: onCommentSubmit</i>)\
    end\
\
    %% Define Connections\
    A -- "props: characterData" --> D\
    A -- "props: assetList" --> E\
    A -- "callback: onUploadSuccess" --> E\
    A -- "props: commentList" --> F\
    A -- "callback: onCommentSubmit" --> F\
\
    E --> E_H\
    E --> E_I\
    E --> E_J\
\
    F --> F_K\
    F --> F_L\
\
    %% Style the nodes\
    style A fill:#a8d1ff,stroke:#333,stroke-width:2px\
    style E fill:#d3b8ff,stroke:#333,stroke-width:1px\
    style F fill:#d3b8ff,stroke:#333,stroke-width:1px\
\
\
\pard\pardeftab720\sa280\partightenfactor0

\f0\b\fs28 \cf0 Component Interaction Flow:\
\pard\tx220\tx720\pardeftab720\li720\fi-720\sa240\partightenfactor0
\ls1\ilvl0
\f3\fs26 \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	1	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Page: /characters/[id]
\f0\fs24  (The Parent Component):
\f1\b0  This is the main component for the route. It's responsible for fetching all initial data (character info, assets, comments) and managing the state for the page. It also defines callback functions (
\f2\fs26 onUploadSuccess
\f1\fs24 , 
\f2\fs26 onCommentSubmit
\f1\fs24 ) that can trigger data refetches.\
\pard\tx220\tx720\pardeftab720\li720\fi-720\sa240\partightenfactor0
\ls1\ilvl0
\f0\b \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	2	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Data Down (Props):
\f1\b0  The main 
\f2\fs26 Page
\f1\fs24  component passes data and callbacks down to its direct children as 
\f2\fs26 props
\f1\fs24 .\
\pard\tx940\tx1440\pardeftab720\li1440\fi-1440\sa240\partightenfactor0
\ls1\ilvl1
\f2\fs26 \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 CharacterHeader
\f1\fs24  receives the static character data.\
\ls1\ilvl1
\f2\fs26 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 AssetGallery
\f1\fs24  receives the list of assets to display and the 
\f2\fs26 onUploadSuccess
\f1\fs24  callback.\
\ls1\ilvl1
\f2\fs26 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 CommentSection
\f1\fs24  receives the list of comments and the 
\f2\fs26 onCommentSubmit
\f1\fs24  callback.\
\pard\tx220\tx720\pardeftab720\li720\fi-720\sa240\partightenfactor0
\ls1\ilvl0
\f0\b \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	3	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 Nested Components & Callbacks:
\f1\b0 \
\pard\tx940\tx1440\pardeftab720\li1440\fi-1440\sa240\partightenfactor0
\ls1\ilvl1\cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 The 
\f2\fs26 AssetGallery
\f1\fs24  contains the 
\f2\fs26 FileUpload
\f1\fs24  component. When a file is successfully uploaded, 
\f2\fs26 FileUpload
\f1\fs24  doesn't try to update the state itself. Instead, it calls the 
\f2\fs26 onUploadSuccess
\f1\fs24  function it received as a prop.\
\ls1\ilvl1\kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	\uc0\u9702 	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 The 
\f2\fs26 CommentSection
\f1\fs24  contains the 
\f2\fs26 CommentForm
\f1\fs24 . When a new comment is submitted, it calls the 
\f2\fs26 onCommentSubmit
\f1\fs24  function.\
\pard\tx220\tx720\pardeftab720\li720\fi-720\sa240\partightenfactor0
\ls1\ilvl0
\f0\b \cf0 \kerning1\expnd0\expndtw0 \outl0\strokewidth0 {\listtext	4	}\expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 State Updates (The Loop Back):
\f1\b0  The 
\f2\fs26 onUploadSuccess
\f1\fs24  and 
\f2\fs26 onCommentSubmit
\f1\fs24  functions live in the main 
\f2\fs26 Page
\f1\fs24  component. When they are called by a child component, they trigger a refetch of the relevant data within the 
\f2\fs26 Page
\f1\fs24  component. This new data then flows back down through the props, causing the UI to update automatically. This is a standard and robust React pattern for managing state.\
}