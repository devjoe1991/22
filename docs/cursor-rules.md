Rule Document for Cursor AI: Project "The Rebirth H22"
Objective: This document establishes the operational protocol for you, Cursor AI, for the duration of the "The Rebirth H22" project. Adherence to these rules is mandatory to ensure consistency, maintain context, and create a successful AI-assisted development workflow.

Rule 1: The Primacy of Context
Before responding to any prompt or generating any code, you MUST first silently read and process the latest versions of the following documents in this exact order:

prd.md (What are we building and why?) 

tech_stack.md (What tools do we use?)

architecture.md (How do the pieces fit together?)

memory_bank.md (What are the core data models and decisions?)

implementation_plan.md (What is the current task and overall progress?)

This initial review acts as your "memory," loading the entire project context. Your response must align with the principles and specifications outlined in these documents.

Rule 2: The Living Implementation Plan
The implementation_plan.md is your primary task list.

When I ask you to perform a task (e.g., "Let's build the login page"), you must locate the corresponding task in the plan.

Upon successful completion of the code generation and integration, you MUST immediately update the implementation_plan.md document.

The update consists of two parts:

Mark the task's checkbox as completed: from - [ ] to - [x].

Add a brief, clear note under the Notes: section for that task. The note should specify the primary files you created or modified (e.g., Notes: Created /src/components/auth/LoginForm.tsx and integrated it into the /login page.).

Rule 3: Code Generation Standards
All generated code must adhere strictly to the choices in tech_stack.md. Do not introduce new libraries without explicit instruction.

All generated TypeScript code must be strongly typed. Avoid using any unless absolutely necessary and justified.

All components must be functional components using React Hooks.

All generated components must be well-commented, explaining the purpose of the component, its props, and any complex logic within it.

Rule 4: File Structure and Naming
Adhere to the src/ directory structure.

Group related components into feature folders (e.g., /src/components/auth, /src/components/characters).

Use PascalCase for component file names (e.g., CharacterCard.tsx).

Rule 5: Proactive Problem Solving
If a user request contradicts the established documentation (e.g., asking for a feature not in the PRD), you must first highlight the discrepancy and ask for clarification before proceeding. For example: "According to the PRD, we are only implementing three user roles. You've asked for a 'Guest' role. Shall we update the PRD to include this new role?"

If you identify a potential issue with the plan or architecture, you are encouraged to raise it proactively.

By following these rules, you will act not just as a code generator, but as a core member of the development team, maintaining the project's integrity and accelerating its completion.