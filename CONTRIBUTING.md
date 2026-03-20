# Contributing to TabFlow

Thanks for your interest in contributing to TabFlow! Here's how to get started.

## Development Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Google Chrome](https://www.google.com/chrome/) or Chromium-based browser

### Getting Started

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/<your-username>/tab-flow.git
   cd tab-flow
   ```

2. Install dependencies (via Docker):

   ```bash
   docker compose run --rm install
   ```

3. Build the extension:

   ```bash
   docker compose run --rm build
   ```

4. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the `dist/` folder

5. For development with auto-rebuild:

   ```bash
   docker compose run --rm dev
   ```

> **Important:** Do not run `npm install` or `npm run build` directly on your host machine. Always use Docker.

## Making Changes

1. Create a feature branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test them in Chrome.

3. Build and verify:

   ```bash
   docker compose run --rm build
   ```

4. Commit with a clear message:

   ```bash
   git commit -m "feat: add your feature description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `refactor:` for code changes that don't add features or fix bugs

5. Push and open a Pull Request against `main`.

## Code Guidelines

- **TypeScript** — all source code is TypeScript. No `any` types.
- **React** — functional components with hooks only.
- **Tailwind CSS** — use the project's design tokens (`brand-*`, `surface-*`).
- **Keyboard-first** — all interactive elements must be keyboard navigable.
- **Cross-platform** — don't hardcode Mac-specific shortcuts or OS assumptions.

## Reporting Issues

- Use [GitHub Issues](https://github.com/rizrepos/tab-flow/issues) to report bugs or request features.
- Include your Chrome version, OS, and steps to reproduce.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
