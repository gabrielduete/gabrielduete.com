# ADR-001: Next.js as Main Framework

## Context

I needed to choose a framework to develop my personal website that would
support:

- Server-side rendering (SSR) for SEO
- Static site generation (SSG) for performance
- Dynamic page creation
- File-based routing
- Native TypeScript support
- Good development experience
- Simple deployment

## Decision

I chose **Next.js v15+** as the main framework, utilizing:

- App Router (new routing architecture)
- Server Components by default
- Client Components when necessary
- Native TypeScript
- API Routes for server-side functionality
- Dynamic Routing for generating dynamic pages

## Alternative Considered

- **Nuxt.js**: Good option, but I preferred the React ecosystem
