import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

const root = process.cwd()

export const getAllArticles = (locale: Langs): IArticle[] => {
  const dirPath = path.join(root, 'src/content/blog', locale)

  const categories = fs.readdirSync(dirPath)

  const articles = categories.flatMap(category => {
    const categoryDir = path.join(dirPath, category)
    const files = fs.readdirSync(categoryDir)

    return files
      .filter(file => file.endsWith('.mdx'))
      .map(filename => {
        const filePath = path.join(categoryDir, filename)
        const source = fs.readFileSync(filePath, 'utf8')

        console.debug(source)

        const { data } = matter(source)

        return {
          title: data.title ?? '',
          description: data.description ?? '',
          date: data.date ?? '',
          category: data.category ?? category,
          tags: data.tags ?? [],
          slug: filename.replace(/\.mdx?$/, ''),
          locale,
        }
      })
  })

  return articles
}

export default getAllArticles
