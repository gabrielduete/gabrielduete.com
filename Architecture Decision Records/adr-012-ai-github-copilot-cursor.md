# ADR-012: AI: GitHub Copilot + Cursor

## Context

I needed tools to:

- Accelerate development
- Generate PR descriptions automatically
- Review code and suggest improvements
- Reduce time on repetitive tasks
- Maintain code quality

## Decision

I implemented **GitHub Copilot** and **Cursor** for development, utilizing:

- **GitHub Copilot**: For generating PR descriptions and reviews
- **Cursor**: IDE with integrated AI for more efficient development
- Integration with development workflow
- Contextual suggestions based on existing code
- Automation of repetitive tasks

## More about

GitHub Copilot helped me a lot, especially for generating PR descriptions and
reviewing PRs. It's really cool how it understands the context and makes
relevant suggestions, it's a lifesaver. especially when we let something small
slip through, like a failure in naming a function.

At the end of development, the company where I work released Cursor, so I took
advantage to use it too. The experience is very good! Cursor has integrated AI
that works very well with a Next.js project.

Example of a Copilot suggestion in a PR:
![GitHub Copilot suggesting improvements in a PR](/public/assets/images/blog/architecture-decisions/copilot.png)
