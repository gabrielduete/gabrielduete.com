# ADR-013: Project Folder Structure

## Context

I needed to organize the code so that:

- It was easy to navigate and understand
- Followed Next.js conventions
- Separated responsibilities clearly

## Decision

I implemented a structure based on Next.js App Router with feature organization:

```
┣ 📂 src
┃ ┣ 📂 app
┃ ┃ ┣ 📂 [locale]
┃ ┃ ┃ ┣ 📂 blog
┃ ┃ ┃ ┃ ┣ 📂 [slug]
┃ ┃ ┃ ┃ ┃ ┣ 📜 page.jsx
┃ ┃ ┃ ┃ ┃ ┗ 📜 page.spec.jsx
┃ ┃ ┃ ┃ ┣ 📂 helpers
┃ ┃ ┃ ┃ ┣ 📂 views
┃ ┃ ┃ ┃ ┣ 📜 index.data.ts
┃ ┃ ┃ ┃ ┣ 📜 page.spec.tsx
┃ ┃ ┃ ┃ ┗ 📜 page.tsx
┃ ┃ ┃ ┣ 📂 career
┃ ┃ ┃ ┣ 📂 components
┃ ┃ ┃ ┃ ┣ 📂 Footer
┃ ┃ ┃ ┃ ┗ 📂 Header
┃ ┃ ┃ ┃ ┃ ┗ 📂 components
┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂 MenuDesktop
┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂 MenuMobile
┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂 Navigator
┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂 ToggleLang
┃ ┃ ┃ ┃ ┃ ┃ ┣ 📂 ToggleTheme
┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜 index.spec.tsx
┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜 index.tsx
┃ ┃ ┃ ┣ 📂 KeyboardEasterEgg
┃ ┃ ┃ ┣ 📂 lab
┃ ┃ ┃ ┣ 📜 layout.tsx
┃ ┃ ┃ ┗ 📜 not-found.tsx
┃ ┣ 📂 components
┃ ┣ 📂 content
┃ ┃ ┣ 📂 blog
┃ ┃ ┃ ┣ 📂 en
┃ ┃ ┃ ┗ 📂 pt-br
┃ ┣ 📂 contexts
┃ ┣ 📂 i18n
┃ ┣ 📂 messages
┃ ┣ 📂 styles
┃ ┣ 📂 types
┃ ┗ 📂 utils
```

## More about

The structure follows the Next.js App Router pattern with some adaptations:

- **`[locale]`**: Internationalized routing
- **`blog/[slug]`**: Dynamic pages for posts
- **`components`**: Reusable components
- **`content`**: MDX content organized by language
- **`i18n`**: Internationalization configurations
- **`messages`**: JSON translations

Each component has its own directory with test files, facilitating maintenance
and testing.
