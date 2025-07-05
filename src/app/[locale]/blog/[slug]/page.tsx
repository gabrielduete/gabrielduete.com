import fs from 'fs'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import path from 'path'

type Props = {
  params: { slug: string; locale: string }
}

export default async function BlogPost({ params }: Props) {
  const filePath = path.join(
    process.cwd(),
    'src/content/blog',
    params.locale,
    `${params.slug}.mdx`,
  )

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { content, data } = matter(fileContent)

  return (
    <article className='prose text-white'>
      <h1>{data.title}</h1>
      <p className='text-sm text-gray-400'>{data.date}</p>
      <MDXRemote source={content} />
    </article>
  )
}
