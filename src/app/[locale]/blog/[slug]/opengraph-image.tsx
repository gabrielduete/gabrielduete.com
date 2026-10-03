import { Locales } from '@/enums/Locales'
import fs from 'fs'
import { ImageResponse } from 'next/og'
import path from 'path'

import { getBlogData } from '../helpers/getDataContentFile'
import {
  formatOgDate,
  getTitleFontSize,
  truncateDescription,
} from '../helpers/ogImage'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Gabriel Duete — Blog post'

// Mirrors the dark theme tokens in src/styles/index.css
const COLORS = {
  bgTheme: '#132227',
  text: '#ffffff',
  muted: 'rgba(255, 255, 255, 0.7)',
  accent: '#46ce7a',
}

const loadFont = (file: string) =>
  fs.readFileSync(path.join(process.cwd(), 'src/assets/og-fonts', file))

type Props = {
  params: Promise<{ slug: string; locale: Locales }>
}

export default async function OpengraphImage({ params }: Props) {
  const { slug, locale } = await params
  const { data } = getBlogData(slug, locale)

  const title = String(data.title ?? '')
  const description = truncateDescription(data.description)
  const date = formatOgDate(data.date)
  const category = typeof data.category === 'string' ? data.category : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: COLORS.bgTheme,
          color: COLORS.text,
          fontFamily: 'Nunito',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 56,
            height: 6,
            borderRadius: 3,
            background: COLORS.accent,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: getTitleFontSize(title),
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                display: 'flex',
                marginTop: 24,
                fontSize: 28,
                lineHeight: 1.4,
                color: COLORS.muted,
              }}
            >
              {description}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            color: COLORS.muted,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {category && (
              <div
                style={{
                  display: 'flex',
                  marginRight: 16,
                  color: COLORS.accent,
                  fontWeight: 800,
                }}
              >
                {category}
              </div>
            )}
            {category && date && (
              <div style={{ display: 'flex', marginRight: 16 }}>·</div>
            )}
            {date}
          </div>
          <div style={{ display: 'flex' }}>gabrielduete.com</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Nunito',
          data: loadFont('nunito-latin-400-normal.woff'),
          weight: 400,
        },
        {
          name: 'Nunito',
          data: loadFont('nunito-latin-800-normal.woff'),
          weight: 800,
        },
      ],
    },
  )
}
