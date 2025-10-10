# ADR-003: Next-intl for Internationalization

## Context

The website needed to support Portuguese and English languages:

- Portuguese (Brazil) as the main language
- English as the secondary language
- SEO optimized for both languages
- Locale-based routing
- Simple translation maintenance

## Decision

I implemented **next-intl 4.1.0** for internationalization, utilizing:

- Locale-based routing (`/en/`, `/pt-br/`)
- JSON files for translations
- Server-side rendering of localized content
- Automatic user language detection
- Fallback to default language
- SEO optimized for multiple languages
- Optimized performance

## Alternatives Considered

- **next-i18next**: Good option, but less integration with App Router
- **Manual implementation**: Too much work and error-prone
