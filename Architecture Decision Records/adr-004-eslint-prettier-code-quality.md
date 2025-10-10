# ADR-004: ESLint + Prettier for Code Quality

## Context

I needed tools to ensure:

- Code consistency
- Error and problem detection
- Automatic formatting
- Development best practices
- Integration with editor and CI/CD

## Decision

I implemented:

- **ESLint 9.21.0** for static analysis
- **Prettier 3.5.1** for formatting
- Next.js integrated configuration
- GitHub Actions integration

## Alternatives Considered

- **Biome**: Faster, but less mature. I've tested it, but being something new, I
  haven't spent enough time to guarantee the technology's support in a more
  long-lasting project like a blog.

## More about

If you're interested, I have this
[gist](https://gist.github.com/gabrielduete/e0d047fcd20bb154a7904267bee50647) on
GitHub where I save the Prettier configurations I use most.
