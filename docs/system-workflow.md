# System Workflow: How It All Connects

The core philosophy of this platform is that no piece of content exists in a vacuum. Every character, scene, and chapter is interconnected to provide a holistic view of the project. This document explains that central workflow.

## The Core Building Blocks

The project is primarily built from three main entities:
* **Characters:** The individuals who inhabit the world.
* **Scenes:** The specific events or situations that occur.
* **Chapters:** The larger narrative sections that group together multiple scenes.

## The "Tagging" System (Many-to-Many Relationships)

The key to the system is the ability to "tag" or link these entities together. This is not a simple one-way tag; it's a flexible, many-to-many relationship stored in the database.

This means:
* A single **Character** can appear in *multiple* Scenes.
* A single **Scene** can feature *multiple* Characters.
* A single **Scene** can belong to *multiple* Chapters (if needed for different story branches).

When you "tag" a character to a scene, you are creating a durable link in the database. This link works both ways—the Character's page will show the Scene, and the Scene's page will show the Character.

## The Payoff: The Visual Workflow Editor

The "tagging" system is the engine, but the **Workflow Editor** is the final output. This is where the project's structure becomes clear.

The editor, built using `React Flow`, reads all the connections you've made and automatically generates a visual diagram.

* Each **Character**, **Scene**, and **Chapter** becomes a **node** (a box) on the canvas.
* Each **"tag"** you've made becomes a **line** connecting those nodes.

This allows you to see, at a glance, the entire narrative flow you described:

```mermaid
graph TD;
    subgraph "Chapter 1: The Awakening"
        S1[Scene 1: The Discovery];
        S2[Scene 2: The Escape];
    end

    C1[Character: "Alex"] --> S1;
    C1 --> S2;
    C2[Character: "Dr. Eva"] --> S1;

    style C1 fill:#f9f,stroke:#333
    style C2 fill:#f9f,stroke:#333