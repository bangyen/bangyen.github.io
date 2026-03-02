# Project Architecture

This document provides a high-level overview of the project's structure and design patterns to help new developers navigate the codebase.

## Feature-Based Architecture

The project follows a **feature-based** organizational structure. Instead of grouping all components, hooks, and types into global folders, they are scoped to specific features within `src/features/`.

```
src/
├── features/
│   ├── games/            # Interactive games (Lights Out, Slant)
│   ├── research/         # Data visualizations (ZSharp, Oligopoly)
│   └── home/             # Landing page
├── components/           # Truly global, reusable UI components (Shared)
├── hooks/                # Global React hooks (useTheme, useWorker, etc.)
└── utils/                # Shared utilities (DSU, math, etc.)
```

### Business Logic vs. View Layer

To keep the codebase maintainable, we strictly separate the "Engine" (mathematical logic and algorithms) from the "View" (React components and UI state).

- **The Engine**: Typically found in `utils/` folders within a feature (e.g., `src/features/games/slant/utils/`). These are pure TypeScript files that can be tested in isolation and even run in Web Workers.
- **The View**: Found in `components/` and `pages/` folders. These use Material-UI and React hooks to manage the interactive experience.

### Key Implementation Patterns

1.  **Web Workers**: Computationally expensive algorithms (like puzzle generation) are often offloaded to Web Workers. See feature-specific `hooks/` directories (e.g., `src/features/games/slant/hooks/useGenerationWorker.ts`) and `workers/` directories.
2.  **Domain-Specific Math**: 
    - **Lights Out**: Uses GF(2) linear algebra. The "brain" is in `src/utils/math/gf2/`.
    - **Slant**: Uses graph theory and Disjoint Set Union (DSU). The "brain" is in `src/features/games/slant/utils/cycleDetection.ts` and `src/utils/DSU.ts`.

## Tooling

- **Bun**: Primary package manager and test runner.
- **Python**: Used for data-heavy research updates (see `bun run data:update`).
- **Vite**: Build pipeline and development server.
- **Vitest**: Unit testing framework mirroring Jest/Mocha APIs.

## Navigation Tips

- If you need to fix a bug in a game's logic, start in `src/features/games/[game-name]/utils/`.
- If you need to change the UI or styling, check `src/features/games/[game-name]/components/`.
- Global constants and routing are managed in `src/config/`.
