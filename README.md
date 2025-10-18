# [gabrielduete.com](https://gabrielduete.com)

My personal blog and portfolio website built with Next.js, featuring
internationalization, modern development practices, and comprehensive
documentation of architectural decisions.

## About the Project

This is my personal website where I share my thoughts, experiences, and
technical insights. The project showcases modern web development practices with
a focus on performance, accessibility, and maintainability.

### Key Features

- **Internationalization**: Support for Portuguese (Brazil) and English
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Performance**: Optimized with Next.js SSR/SSG and Vercel Edge Network
- **Testing**: Comprehensive test coverage with Jest and Testing Library
- **Analytics**: User behavior insights with Microsoft Clarity
- **SEO**: Optimized for search engines with proper meta tags and sitemap
- **Dark Mode**: Theme switching with next-themes
- **MDX**: Rich content with MDX for blog posts

### Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Styling**: TailwindCSS v4+
- **Language**: TypeScript
- **Internationalization**: next-intl
- **Testing**: Jest + Testing Library
- **Deployment**: Vercel
- **Monitoring**: Sentry
- **Analytics**: Microsoft Clarity
- **Code Quality**: ESLint + Prettier

## How to Run the Project

### Prerequisites

- Node.js 18+
- Yarn or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/gabrielduete/gabrielduete.com.git
   cd gabrielduete.com
   ```

2. **Install dependencies**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Run the development server**

   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. **Open your browser** Navigate to
   [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier
- `yarn test` - Run tests
- `yarn test:coverage` - Run tests with coverage

## Architecture Decision Records (ADRs)

This project follows the Architecture Decision Records (ADRs) pattern to
document important architectural decisions made during development. Each ADR
captures the context, decision, and consequences of significant choices.

### What are ADRs?

ADRs help maintain a clear record of why certain technologies and patterns were
chosen, making it easier for future developers (including yourself) to
understand the reasoning behind architectural decisions.

### ADR Documentation

- **[ADR Directory](./Architecture%20Decision%20Records/)** - Individual ADR
  files with detailed explanations
- **[Blog Post - English](gabrielduete.com/en/blog/architecture-decisions)** -
  Full blog post with all ADRs
- **[Blog Post - Portuguese](gabrielduete.com/pt-br/blog/architecture-decisions)** -
  pt-br version

### Key ADRs

- **ADR-001**: Next.js as Main Framework
- **ADR-002**: TailwindCSS for Styling
- **ADR-003**: Next-intl for Internationalization
- **ADR-004**: ESLint + Prettier for Code Quality
- **ADR-005**: Jest for Testing
- **ADR-006**: Codecov for Test Coverage
- **ADR-007**: Sentry for Error Monitoring
- **ADR-008**: GitHub Actions for CI/CD
- **ADR-009**: Microsoft Clarity for Analytics
- **ADR-010**: Vercel for Deploy and Hosting
- **ADR-011**: GitHub Projects for Tazsk Management
- **ADR-012**: AI: GitHub Copilot + Cursor
- **ADR-013**: Project Folder Structure

## How to Contribute

Contributions are welcome! Here's how you can help:

### Reporting Issues

- Use the [Issues](https://github.com/gabrielduete/gabrielduete.com/issues) tab
- Provide clear description and steps to reproduce
- Include screenshots if applicable

### Suggesting Features

- Open a new issue with the "enhancement" label
- Describe the feature and its benefits
- Consider the project's scope and goals

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation if needed
4. **Run tests and linting**
   ```bash
   yarn test
   yarn lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow ESLint and Prettier configurations
- **Testing**: Maintain test coverage above 80%
- **Documentation**: Update ADRs for architectural changes
- **Commits**: Use conventional commit messages
- **Branching**: Use feature branches for new work

### Content Contributions

- **Blog Posts**: Submit new posts in both English and Portuguese
- **Translations**: Help improve existing translations
- **Documentation**: Enhance project documentation

## License

This project is open source and available under the [MIT License](LICENSE).

## Links

- **Website**: [gabrielduete.com](https://gabrielduete.com)
- **Blog**: [gabrielduete.com/blog](https://gabrielduete.com/blog)
- **GitHub**: [github.com/gabrielduete](https://github.com/gabrielduete)
- **LinkedIn**:
  [linkedin.com/in/gabrielduete](https://linkedin.com/in/gabrielduete)

---

Made with hardwork by [Gabriel Duete](https://gabrielduete.com)
