# Bangyen's Personal Website

[![React](https://img.shields.io/badge/React-19.2.3-blue.svg?logo=react)](https://react.dev/)
[![MUI](https://img.shields.io/badge/MUI-7.3.7-007FFF?logo=mui)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)](https://vitejs.dev/)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-green.svg?logo=github)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A personal portfolio showcasing interactive games, algorithm implementation, and research visualization. Built with React and optimized with Vite.

**Live Site**: [https://bangyen.github.io](https://bangyen.github.io)

## Features

### Interactive Games
- **Lights Out**: Grid puzzle game with [algebraic solver](src/features/games/lights-out/README.md) (pure TypeScript GF(2) linear algebra)
- **Slant**: Diagonal line logic puzzle with procedural generation and cycle detection

### Research & Visualization
- **ZSharp**: Sharpness-Aware Minimization (SAM) visualization comparing ML optimization algorithms
- **Oligopoly**: Cournot competition economic simulation with interactive parameter controls

### Technical Highlights
- **Pure TypeScript**: All game logic and algorithms implemented in TypeScript (no WASM)
- **Algorithm Showcase**: Lights Out (GF(2) linear algebra), Slant (graph theory + DSU)
- **Responsive Design**: Glassmorphism UI with dark/light theme toggle
- **Game Features**: Grid sizing, localStorage persistence, algebraic solving, procedural generation
- **Modern React**: React 19 with hooks, Material-UI 7, Vite 7 for fast builds
- **Streamlined Tooling**: ESLint 9 (Flat Config) + Prettier for code quality

## Tech Stack

- **Frontend**: React 19, Material-UI 7, React Router 7
- **Build Tooling**: Vite 7, TypeScript 5, Bun
- **Styling**: Vanilla CSS, Emotion
- **Data & Visualization**: KaTeX (Math), Recharts (Charts)
- **Testing**: Vitest 4, React Testing Library
- **Quality Control**: ESLint 9 (Flat Config), Prettier 3, Husky, lint-staged
- **Deployment**: GitHub Pages, Bun (package manager)


## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.1 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bangyen/bangyen.github.io.git
cd bangyen.github.io
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `bun start` - Start Vite development server on localhost:3000
- `bun run build` - Create production build in `build/` directory
- `bun run build:analyze` - Build and analyze bundle sizes
- `bun test` - Run Vitest tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:ci` - Run tests in CI mode (used by GitHub Actions)
- `bun run test:coverage` - Generate coverage report
- `bun run type-check` - Run TypeScript type checking
- `bun run lint` - Run ESLint checks
- `bun run lint:fix` - Auto-fix ESLint issues
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check Prettier formatting
- `bun run lint:all` - Run lint and format checking
- `bun run deploy` - Deploy to GitHub Pages (gh-pages branch)

## Project Structure

```
src/
├── components/           # Shared UI components
│   ├── layout/          # PageLayout, Navigation, ErrorBoundary
│   ├── ui/              # Reusable controls (CustomGrid, GlassCard, etc.)
│   └── icons/           # Material-UI icons
├── config/              # Global configuration
│   ├── constants/       # Routes, page titles, app configuration
│   └── theme/           # MUI theme, colors, typography
├── features/            # Feature-based architecture
│   ├── games/          # Lights Out & Slant games
│   │   ├── lights-out/ # Lights Out solver & UI
│   │   ├── slant/      # Slant puzzle generator & solver
│   │   ├── components/ # Shared game components (Board, etc.)
│   │   ├── hooks/      # Game-specific hooks
│   │   ├── types/      # Game type definitions
│   │   └── config/     # Game configuration & constants
│   ├── research/       # Research data visualization
│   │   ├── pages/      # ZSharp, Oligopoly pages
│   │   └── workers/    # Web Workers for computation
│   └── home/           # Landing page with projects
├── hooks/              # Global React hooks (useTheme, useWorker, etc.)
├── utils/              # Shared utilities
│   ├── math/gf2/      # GF(2) linear algebra (Lights Out solver)
│   └── DSU.ts         # Disjoint Set Union (Slant cycle detection)
├── styles/             # Global CSS (animations)
└── index.tsx          # App entry point with routing
```

## Development

**Testing**: Vitest with React Testing Library. Run `bun run test:coverage` for reports.  
**Code Quality**: Automated via ESLint 9 and Husky pre-commit hooks.  
**Continuous Integration**: GitHub Actions verify all PRs via linting and unit testing via Bun.
