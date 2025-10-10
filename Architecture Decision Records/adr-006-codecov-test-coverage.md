# ADR-006: Codecov for Test Coverage

## Context

I needed a tool to:

- Monitor test code coverage
- Ensure new commits don't reduce coverage
- Visualize coverage reports
- Integrate with GitHub Actions
- Be free for open source projects

## Decision

I implemented **Codecov** for coverage monitoring, utilizing:

- Automatic coverage report upload
- GitHub Actions integration
- Coverage badges in README
- Alerts when coverage decreases
- Detailed visual reports

Dashboard:
![Codecov dashboard showing code coverage reports](/public/assets/images/blog/architecture-decisions/codecov-1.png)

Local coverage file:
![Coverage dashboard showing code coverage reports](/public/assets/images/blog/architecture-decisions/codecov-2.png)

## Alternatives Considered

- **SonarQube**: Very good too, but I decided to give Codecov a chance, I've
  been using SonarQube for a long time and wanted to try something different.
- **Manual tracking**: Tedious and error-prone
- **No monitoring**: Risk of low coverage
