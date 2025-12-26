Agent instructions:

- Always research the codebase before starting any task.
- Read @README.md first.
- Use `pnpm` for package management. Do not use `npm` or `yarn` under any circumstances.
- Always keep things as straightforward as possible. Keep it simple. Do not add complexity.
- Never use `Any` type in Typescript. Never ignore typing errors. If you hit a typing error multiple times in a row, ask the user for help.

Deployment:
- This project builds a Docker image on merge to main.
- The production deployment uses in K3s cluster in a homelab. Production deployment is triggered in a separate repository.
