import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body{
    font-family: "Nunito", sans-serif;
  }

  // Colors
  --color-white: #FFFFFF;
  --color-green-black: #20272F;
  --color-green-white: #3C5768;
  --color-green-border: #132227;
  --color-green-strong: #193038;
  --color-green-weak: #46CE7A40;
  --color-green-neutral: #46CE7A;

  // Spacings
  --spacing-xxsmall: 4px;
  --spacing-xsmall: 8px;
  --spacing-small: 12px;
  --spacing-base: 16px;
  --spacing-medium: 20px;
  --spacing-large: 24px;
  --spacing-xlarge: 28px;
  --spacing-xxlarge: 32px;
  --spacing-xxxlarge: 40px;
  --spacing-xxxxlarge: 48px;
  --spacing-giant: 64px;
  --spacing-xgiant: 80px;

  // Typography
  --title-giant: 32px;
  --title-headline: 24px;
  --subtitle: 20px;
  --subtitle-small: 18px;
  --text-xlarge: 24px;
  --text-large: 20px;
  --text-medium: 16px;
  --text-xsmall: 14px;
  --text-small: 12px;
`

export default GlobalStyle
