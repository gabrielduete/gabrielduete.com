import { Locales } from '@/enums/Locales'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

export type PostEntry = {
  slug: string
  locale: string
  title: string
  url: string
  content: string
}

const BLOG_ROOT = path.join(process.cwd(), 'src/content/blog')

export function listAllPosts(): PostEntry[] {
  const locales = [Locales.EN, Locales.PT_BR]
  const entries: PostEntry[] = []

  for (const locale of locales) {
    const dir = path.join(BLOG_ROOT, locale)
    if (!fs.existsSync(dir)) continue

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
      const { content, data } = matter(raw)

      entries.push({
        slug,
        locale,
        title: typeof data.title === 'string' ? data.title : slug,
        url: `/${locale}/blog/${slug}`,
        content,
      })
    }
  }

  return entries
}
