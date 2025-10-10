# ADR-010: Vercel for Deploy and Hosting

## Context

I needed a deployment platform that:

- Integrated with Next.js
- Supported SSR and SSG
- Had global CDN
- Offered automatic deployment
- Had good performance and reliability

## Decision

I chose **Vercel** as the hosting platform, utilizing:

- Automatic deployment via GitHub
- Global Edge Network CDN
- Preview deployments for PRs (This helped a lot!)
- Custom domain
