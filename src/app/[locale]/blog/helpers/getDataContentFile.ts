import { Locales } from '@/enums/Locales'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

export function getBlogData(slug: string, locale: Locales) {
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
