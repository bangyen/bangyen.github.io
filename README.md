# Bangyen's Personal Website

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg?logo=react)](https://reactjs.org/)
[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-green.svg?logo=github)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A personal website and portfolio showcasing interactive programming interpreters, games, and web development projects. Built with React and deployed on GitHub Pages.

**Live Site**: [https://bangyen.github.io](https://bangyen.github.io)

## Features

### Programming Language Interpreters
- **Stun Step**: Brainfuck-like esoteric language
- **Suffolk**: Minimal register-based language
- **WII2D**: 2D grid-based programming language
- **Back**: Grid-based language with mirror reflections

### Interactive Games
- **Snake**: Classic snake game
- **Lights Out**: Grid puzzle game

### Data Visualization
- **Oligopoly**: Economic simulation with market dynamics
- **ZSharp**: ML experiment comparing optimization algorithms

### Technical Features
- Responsive design with Material-UI components
- Real-time code execution and visualization
- Interactive grid-based programming environments
- Step-by-step program execution with debugging tools
- Tape, register, and output displays for interpreters

## Tech Stack

- **Frontend**: React 18, Material-UI, React Router
- **Styling**: Emotion (styled components)
- **Charts**: Recharts
- **Testing**: Jest, React Testing Library
- **Tools**: ESLint, Prettier, Stylelint, Husky
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bangyen/bangyen.github.io.git
cd bangyen.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Development server
- `npm test` - Run tests
- `npm run test:coverage` - Test coverage report
- `npm run build` - Production build
- `npm run lint:all` - Run all linting checks
- `npm run deploy` - Deploy to GitHub Pages

## Project Structure

```
src/
├── Interpreters/     # Programming language interpreters
├── Pages/           # Application pages (Home, Games, Visualizations)
├── __tests__/       # Test files
└── utils/           # Helper functions and utilities
```

## How to Use

### Interpreters
1. Navigate to any interpreter from the home page menu
2. Write code in the left panel using the language's syntax
3. Use the toolbar to run, pause, step through, or reset your program
4. View program execution details in the displays below:
   - **Program**: Shows current instruction
   - **Output**: Displays program output
   - **Tape**: Shows memory state (for applicable languages)
   - **Register**: Shows register values (for applicable languages)

### Games
- **Snake**: Use arrow keys to control the snake
- **Lights Out**: Click lights to toggle them and solve the puzzle

### Data Visualization
- **Oligopoly**: Economic simulation with market dynamics
- **ZSharp**: ML experiment comparing optimization algorithms

## Development

**Testing**: Jest, React Testing Library with coverage reports  
**Code Quality**: ESLint, Prettier, Stylelint with pre-commit hooks  
**Tools**: Husky, lint-staged for automated quality checks
