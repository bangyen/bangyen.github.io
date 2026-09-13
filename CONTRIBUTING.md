# Contributing

## Development workflow

1. Install Bun 1.3.9 and run `bun install --frozen-lockfile`.
2. Create a focused branch and make the smallest coherent change.
3. Add tests at the behavior boundary: algorithms get unit tests, components
   get Testing Library tests, and user journeys get Playwright tests.
4. Run `bun run ci` before opening a pull request.
5. Run `bun run test:e2e` after routing, interaction, persistence,
   accessibility, or responsive-layout changes.

Do not commit `build/`, `coverage/`, `stats.html`, temporary research clones, or
local editor settings.

## Design and accessibility

- Reuse tokens from `src/config/theme` for colors, spacing, and animations.
- Give every interactive element keyboard access and an accessible name.
- Preserve visible focus states and reduced-motion behavior.
- Give canvas interfaces an equivalent semantic interaction layer.
- Verify light and dark themes and a narrow mobile viewport.

## Architecture

Keep domain algorithms pure and independent from React. Feature-specific code
belongs under its feature; move it into a shared directory only after a second
consumer exists. Worker messages should use explicit typed protocols.

## Research data

Run `bun run data:update` only when source experiments change. It uses Python
and Git, creates ignored temporary repositories, and updates compressed assets
under `public/`. Review data size and visualization behavior before committing.
