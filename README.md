# mono-game

Monorepo for web-based (React, Vite, Node.js) games.

## Current State

### 🎮 Games

- **hidden-game**: A hidden object finding game with timer and click detection

### 📦 Shared Packages

- **@mono-game/shared**: Core shared utilities and types
- **@mono-game/shared-styles**: Shared SCSS styles and mixins
- **@mono-game/shared-ui**: Reusable UI components

## Features

- Monorepo structure using pnpm workspaces
- Shared components in multiple packages
- Each game is a separate app (React/Vite)
- TypeScript, Tailwind CSS, Prettier, unit testing
- Easy SonarQube integration
- Simple, clear folder structure

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (install with `npm install -g pnpm`)

### Install dependencies

```bash
pnpm install
```

### Start the Hidden Game

```bash
pnpm --filter hidden-game dev
```

### Create a new game

```bash
pnpm create vite apps/<game-name> -- --template react-ts
cd apps/<game-name>
pnpm install
```

### Shared components

- Place shared utilities in `packages/shared`
- Place shared styles in `packages/shared-styles`
- Place shared UI components in `packages/shared-ui`
- Import from `@mono-game/shared`, `@mono-game/shared-styles`, or `@mono-game/shared-ui` in your apps

### Formatting & Linting

- Run `pnpm prettier` to format code

### Testing

- Run `pnpm test` to execute unit tests

### SonarQube

- Configure SonarQube in the root or per package as needed

## Project Structure

```
mono-game/
├── apps/                    # Individual games (React/Vite apps)
│   └── hidden-game/         # Hidden object finding game
├── packages/                # Shared packages
│   ├── shared/              # Core shared utilities and types
│   ├── shared-styles/       # Shared SCSS styles and mixins
│   └── shared-ui/           # Reusable UI components
├── .github/                 # GitHub configs & instructions
├── README.md                # This file
├── package.json             # Root config
└── pnpm-workspace.yaml      # Workspace config
```

## Hidden Game Features

- **Timer**: Tracks time elapsed during gameplay
- **Click Detection**: Click on objects to find them
- **Visual Feedback**: Shows found objects with checkmarks
- **Difficulty Control**: Adjustable tolerance for click accuracy
- **Progress Tracking**: Shows which objects remain to be found

## Contributing

- Keep code simple and well-documented
- Use shared components where possible
- Follow TypeScript best practices
- Update this README when adding new games or packages
- See this README for setup steps
