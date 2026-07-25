import { Locales } from '@/enums/Locales'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

const SLUG_PATTERN = /^[a-zA-Z0-9._-]+$/

export function isValidSlug(slug: unknown): slug is string {
  return (
    typeof slug === 'string' &&
    SLUG_PATTERN.test(slug) &&
    !slug.includes('..') &&
    slug !== '.'
  )
}

export function getBlogData(slug: string, locale: Locales) {
  if (!isValidSlug(slug)) {
    throw new Error(`Invalid blog slug: ${JSON.stringify(slug)}`)
  }

  const filePath = path.join(
    process.cwd(),
    'src/content/blog',
    locale,
    `${slug}.mdx`,
  )

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { content, data } = matter(fileContent)

  return { content, data }
}
