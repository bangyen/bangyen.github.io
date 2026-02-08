# Bangyen's Personal Website

[![React](https://img.shields.io/badge/React-19.2.3-blue.svg?logo=react)](https://react.dev/)
[![MUI](https://img.shields.io/badge/MUI-7.3.7-007FFF?logo=mui)](https://mui.com/)
[![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite)](https://vitejs.dev/)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-green.svg?logo=github)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A personal website and portfolio showcasing interactive programming interpreters, games, and web development projects. Built with React and optimized with Vite.

**Live Site**: [https://bangyen.github.io](https://bangyen.github.io)

## Features

### Programming Language Interpreters
- **Stun Step**: Brainfuck-like esoteric language
- **Suffolk**: Minimal register-based language
- **WII2D**: 2D grid-based programming language
- **Back**: Grid-based language with mirror reflections

### Interactive Games
- **Slant**: Diagonal line logic puzzle
- **Lights Out**: Grid puzzle game with [algebraic analysis](src/features/games/lights-out/README.md)

### Knowledge Collections
- **Geography Quizzes**: Interactive map-based learning using Wikipedia data


### Data Visualization
- **Oligopoly**: Economic simulation with market dynamics
- **ZSharp**: ML experiment comparing optimization algorithms

### Technical Features
- **Modern React**: Leverages React 19 features and MUI 7 components.
- **Fast Build System**: Migrated from CRA to Vite for lightning-fast HMR and optimized builds.
- **Zero-Warning Linting**: Strict ESLint 9 (Flat Config) standard for code quality.
- **Responsive UI**: Glassmorphism aesthetics with Material-UI v7.
- **Step-by-step Execution**: Real-time program visualization for interpreters.

## Tech Stack

- **Frontend**: React 19, Material-UI 7, React Router 7
- **Build Tooling**: Vite 7, TypeScript 5, Bun
- **Styling**: Vanilla CSS, Emotion
- **Data**: KaTeX (Math), Recharts (Visuals)
- **Testing**: Vitest 4, React Testing Library
- **Quality Control**: ESLint 9 (Flat Config), Prettier 3, Husky, lint-staged
- **Deployment**: GitHub Pages


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

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Available Scripts

- `bun start` - Start Vite development server
- `bun run build` - Create production build
- `bun test` - Run Vitest tests
- `bun run test:ci` - Run tests in CI mode
- `bun run type-check` - Run TypeScript type checking
- `bun run lint:all` - Run all linting (ESLint, Prettier, Stylelint)
- `bun run format` - Format code with Prettier
- `bun run deploy` - Deploy to GitHub Pages
- `bun run scrape:quizzes` - Scrape quiz data from Wikipedia
- `bun run data:update` - Update research data (requires repo cloning)

## Project Structure

```
src/
├── components/      # Shared UI components (Cores, UI, Layout)
├── config/          # Global configurations & themes
├── features/        # Feature-based components (Games, Interpreters, Quiz, Research)
│   ├── games/
│   ├── interpreters/
│   ├── quiz/
│   └── research/
├── hooks/           # Custom React hooks
├── utils/           # Shared utility functions
└── index.tsx        # Application entry point
```

## Development

**Testing**: Vitest with React Testing Library. Run `bun run test:coverage` for reports.  
**Code Quality**: Automated via ESLint 9 and Husky pre-commit hooks.  
**Continuous Integration**: GitHub Actions verify all PRs via linting and unit testing via Bun.
