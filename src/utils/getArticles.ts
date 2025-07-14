import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

const root = process.cwd()

export const getAllArticles = (locale: Langs): IArticle[] => {
  const dirPath = path.join(root, 'src/content/blog', locale)

  const files = fs.readdirSync(dirPath)

  const articles = files
    .filter(file => file.endsWith('.mdx'))
    .map(filename => {
      const filePath = path.join(dirPath, filename)
      const source = fs.readFileSync(filePath, 'utf8')

      const { data } = matter(source)

      return {
        title: data.title ?? '',
        description: data.description ?? '',
        date: data.date ?? '',
        tags: data.tags ?? [],
        slug: filename.replace(/\.mdx?$/, ''),
        category: data.category ?? '',
        locale,
        pinned: data.pinned ?? false,
      }
    })

  return articles as IArticle[]
}

export const getPinnedArticles = (locale: Langs): IArticle[] => {
  const articles = getAllArticles(locale)

  const pinnedArticles = articles.filter(article => article?.pinned)

  return pinnedArticles
}

export default getAllArticles
