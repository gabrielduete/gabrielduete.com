# ADR-005: Jest for Testing

## Context

I needed a testing strategy that:

- Worked well with Next.js and React
- Supported TypeScript
- Had good CI/CD integration
- Generated coverage reports
- Was easy to configure and maintain

## Decision

I implemented **Jest 30.0.2** as the testing framework, utilizing:

- Testing Library for component tests
- Custom configuration for Next.js
- Automatic and monitored code coverage
- Mocks for external dependencies
- GitHub Actions integration
