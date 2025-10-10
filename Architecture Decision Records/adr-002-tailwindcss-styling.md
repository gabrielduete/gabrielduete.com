# ADR-002: TailwindCSS for Styling

## Context

I needed a styling solution that:

- Was consistent and scalable
- Reduced custom CSS
- Had good performance
- Was easy to maintain
- Supported design system

## Decision

I implemented **TailwindCSS v4+** as the styling solution, utilizing:

- Design tokens consistent
- Automatic CSS purge for unused styles
- Dark mode support

## Alternatives Considered

- **Styled Components**: I really like CSS-in-JS, but styled components is
  [discontinued](https://opencollective.com/styled-components/updates/thank-you).
  Better not take the risk. :p
