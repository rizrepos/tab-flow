# TabFlow

Professional tab & workspace manager for Chrome. Organize, search, and switch tabs effortlessly with a keyboard-first experience.

## Features

- **Tab Search** — instantly find any open tab
- **Tab Groups** — view and manage Chrome tab groups with color coding
- **Session Management** — save, restore, and organize tab sessions
- **Import/Export** — back up and share your sessions
- **Keyboard Navigation** — full keyboard-first workflow
- **Keyboard Shortcuts**
  - `Ctrl+Shift+Space` (`Cmd+Shift+Space` on Mac) — Open TabFlow
  - `Ctrl+Shift+K` (`Cmd+Shift+K` on Mac) — Search saved sessions

## Development Setup

### Prerequisites

- Docker & Docker Compose

### Build

```bash
docker compose run --rm app npm run build
```

### Dev (watch mode)

```bash
docker compose run --rm app npm run dev
```

### Load in Chrome

1. Build the extension
2. Open `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist/` folder

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Chrome Extension Manifest V3

## License

[MIT](LICENSE)
