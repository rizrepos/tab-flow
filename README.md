# TabFlow

Professional tab & workspace manager for Chrome. Organize, search, and switch tabs effortlessly with a keyboard-first experience.

## Install

1. Download `tabflow-v0.1.0.zip` from the [latest release](https://github.com/rizrepos/tab-flow/releases/latest)
2. Unzip the file
3. Open `chrome://extensions/`
4. Enable **Developer mode** (top-right toggle)
5. Click **Load unpacked** and select the unzipped folder

## Features

- **Tab Search** — instantly find any open tab by title or URL
- **Chrome Tab Groups** — view and manage tab groups with native color coding
- **Session Management** — save, restore, and organize tab sessions with groups preserved
- **Import / Export** — back up sessions as JSON, move them between machines
- **Keyboard Navigation** — full keyboard-first workflow for power users
- **Dark / Light Mode** — auto-detects system preference, toggleable
- **Global Shortcuts** (configurable via `chrome://extensions/shortcuts`)
  - `Ctrl+Shift+Space` (`Cmd+Shift+Space` on Mac) — Open TabFlow
  - `Ctrl+Shift+K` (`Cmd+Shift+K` on Mac) — Search saved sessions (works globally)

## Keyboard Shortcuts (inside popup)

| Key | Action |
|---|---|
| `↑` `↓` `j` `k` | Navigate items |
| `Enter` | Open / restore selected item |
| `x` | Close selected tab |
| `/` | Focus search |
| `→` `l` | Expand session or group |
| `←` `h` | Collapse |
| `Esc` | Deselect |

## Development

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose

### Commands

```bash
# Install dependencies
docker compose run --rm install

# Build the extension
docker compose run --rm build

# Watch mode (auto-rebuild on changes)
docker compose run --rm dev
```

### Load in Browser

1. Build the extension
2. Open `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `dist/` folder

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Chrome Extension Manifest V3

## Privacy

TabFlow stores all data locally on your device. No data is collected, transmitted, or shared. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

[MIT](LICENSE)
