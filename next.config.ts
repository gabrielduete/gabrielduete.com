import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['en', 'pt-BR'],
    localeDetection: false,
  },
}

export default nextConfig
