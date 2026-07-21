Agent instructions:

- Always research the codebase before starting any task.
- Read @README.md first.
- Use `pnpm` for package management. Do not use `npm` or `yarn` under any circumstances.
- Always keep things as straightforward as possible. Keep it simple. Do not add complexity.
- Never use `Any` type in Typescript. Never ignore typing errors. If you hit a typing error multiple times in a row, ask the user for help.

Deployment:
- This project deploys to Cloudflare Pages via GitHub Actions (`.github/workflows/cloudflare-pages.yml`).
- Pushes to main deploy to production; pull requests get per-branch preview deployments.
