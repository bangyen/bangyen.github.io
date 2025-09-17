# Bangyen's Personal Website

A personal website and portfolio showcasing interactive programming interpreters, games, and web development projects. Built with React and deployed on GitHub Pages.

🌐 **Live Site**: [https://bangyen.github.io](https://bangyen.github.io)

## 🎮 Features

### Programming Language Interpreters
- **Stun Step**: A Brainfuck-like esoteric programming language interpreter
- **Suffolk**: A minimal programming language interpreter with RISC-V equivalent display
- **WII2D**: A 2D grid-based programming language interpreter
- **Back**: A grid-based programming language interpreter

### Interactive Games
- **Snake**: Classic snake game with responsive controls
- **Lights Out**: Puzzle game where you turn off all lights on a grid

### Technical Features
- Responsive design with Material-UI components
- Real-time code execution and visualization
- Interactive grid-based programming environments
- Step-by-step program execution with debugging tools
- Tape, register, and output displays for interpreters

## 🛠️ Tech Stack

- **Frontend**: React 17, Material-UI (MUI)
- **Routing**: React Router DOM
- **Styling**: Emotion (styled components)
- **Icons**: Material-UI Icons, React Icons
- **Build Tool**: Create React App
- **Deployment**: GitHub Pages

## 🚀 Getting Started

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

## 📜 Available Scripts

### Development
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production

### Code Quality
- `npm run lint` - Runs ESLint on source files
- `npm run lint:fix` - Fixes ESLint issues automatically
- `npm run format` - Formats code with Prettier
- `npm run format:check` - Checks code formatting
- `npm run stylelint` - Runs Stylelint on CSS/SCSS files
- `npm run stylelint:fix` - Fixes Stylelint issues automatically
- `npm run lint:all` - Runs all linting checks

### Deployment
- `npm run predeploy` - Builds the app for production
- `npm run deploy` - Deploys to GitHub Pages

## 🏗️ Project Structure

```
src/
├── Interpreters/          # Programming language interpreters
│   ├── Text/             # Text-based interpreters (StunStep, Suffolk)
│   ├── Grid/             # Grid-based interpreters (WII2D, Back)
│   ├── Editor.js         # Main editor component
│   ├── Toolbar.js        # Editor toolbar with controls
│   └── Display.js        # Program execution displays
├── Pages/                # Main application pages
│   ├── Home.js           # Landing page
│   ├── Snake.js          # Snake game
│   └── Lights/           # Lights Out game
├── helpers.js            # Utility functions
├── hooks.js              # Custom React hooks
└── index.js              # Main application entry point
```

## 🎯 How to Use

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

## 🔧 Development

This project uses several development tools for code quality:

- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting
- **Stylelint**: CSS/SCSS linting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files
