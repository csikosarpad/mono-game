# mono-game

Monorepo for web-based (React, Vite, Node.js) games.

## Features

- Monorepo structure using pnpm workspaces
- Shared components in a common package
- Each game is a separate app (e.g., hidden-game, hangman)
- TypeScript, Tailwind CSS, Prettier, unit testing
- Easy SonarQube integration
- Simple, clear folder structure

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (install with `npm install -g pnpm`)

### Install dependencies

```
pnpm install
```

### Create a new game

```
pnpm create vite apps/<game-name> -- --template react-ts
cd apps/<game-name>
pnpm install
```

### Start a game

```
pnpm --filter <game-name> dev
```

### Shared components

- Place shared code in `packages/shared`
- Import from `@mono-game/shared` in your apps

### Formatting & Linting

- Run `pnpm prettier` to format code

### Testing

- Run `pnpm test` to execute unit tests

### SonarQube

- Configure SonarQube in the root or per package as needed

## Project Structure

```
mono-game/
  apps/           # Individual games (React/Vite apps)
  packages/       # Shared packages (e.g., shared components)
  .github/        # GitHub configs & instructions
  README.md       # This file
  package.json    # Root config
  pnpm-workspace.yaml # Workspace config
```

## Contributing

- Keep code simple and well-documented
- Use shared components where possible
- See this README for setup steps
