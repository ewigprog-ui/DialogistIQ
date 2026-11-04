# DialogistIQ

A free, open-source desktop writing studio for screenwriters and novelists. It covers the whole
journey from first idea and brainstorming to a production-ready screenplay (US/Final Draft style
formatting) or a manuscript, and comes with AI roles that know your story.

*Eine freie Schreibwerkstatt für Drehbuch- und Romanautor:innen. · Свободная студия для сценаристов и писателей.*

> **Status:** stage 0 (skeleton). Nothing is usable for writing yet.

## Principles

- **Free for everyone.** No paid features, no subscriptions, no account, no telemetry by default.
- **Local first.** Projects are plain files in an open format on your disk, versioned with built-in git.
- **The author decides.** AI only suggests; nothing changes without your confirmation.
- **Bring your own AI.** Use local models (Ollama, LM Studio) or your own OpenAI/Anthropic keys.
- **Languages:** German (default), English, Russian.

The full specification is the project bible: [PROJECT_BIBLE.md](PROJECT_BIBLE.md) (Russian).

## Development

Requirements: [Node.js](https://nodejs.org) 22+, [pnpm](https://pnpm.io) 10+,
[Rust](https://rustup.rs) (stable) and the [Tauri prerequisites](https://tauri.app/start/prerequisites/)
for your OS (on Windows: Microsoft C++ Build Tools and WebView2).

```sh
pnpm install
pnpm tauri dev          # run the desktop app
pnpm test               # unit tests
pnpm typecheck          # TypeScript
pnpm licenses:check     # licence policy for all npm + Rust dependencies
pnpm licenses:notices   # generate THIRD_PARTY_NOTICES.md
```

Before adding any dependency, font, sound or icon, read the licence policy in
[PROJECT_BIBLE.md §13](PROJECT_BIBLE.md) — CI fails on licences that are not GPL-3.0 compatible.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

Copyright © the contributors.

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version. See [LICENSE](LICENSE).

*Final Draft is a trademark of its respective owner. This project is not affiliated with it; the
name is used only to describe file-format compatibility.*
