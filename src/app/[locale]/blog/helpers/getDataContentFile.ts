import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'

type GetDataParams = {
  slug: string;
  locale: string;
}

export const getData = ({ params }: { params: GetDataParams }) => {
  const { slug, locale } = params

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
