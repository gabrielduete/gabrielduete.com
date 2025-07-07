import BackButton from '@/components/BackButton'
import { GiscusComments } from '@/components/Giscus'
import ScrollTopButton from '@/components/ScrollTopButton'
import { Paths } from '@/enums/Paths'
import fs from 'fs'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import path from 'path'

const BlogPost = async ({ params }) => {
  const { slug, locale } = await params

  const filePath = path.join(
    process.cwd(),
    'src/content/blog',
    locale,
    `${slug}.mdx`,
  )

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { content, data } = matter(fileContent)

  if (params === undefined) {
    notFound()
  }

  return (
    <section className='text-primary'>
      <BackButton path={Paths.BLOG} />
      <h1 className='text-title-xgiant font-bold mb-xxsmall'>{data.title}</h1>
      <p className='text-xsmall text-gray-400 mb-large'>{data.date}</p>
      <div>
        <MDXRemote
          source={content}
          components={{
            h1: props => (
              <h1
                className='text-title-giant font-bold mb-small mt-small'
                {...props}
              />
            ),
            h2: props => (
              <h2
                className='text-title-headline font-semibold mb-small'
                {...props}
              />
            ),
            p: props => (
              <p className='text-large mb-small leading-relaxed' {...props} />
            ),
            ul: props => (
              <ul className='list-disc pl-large mb-base' {...props} />
            ),
            ol: props => (
              <ol className='list-decimal pl-large mb-base' {...props} />
            ),
            img: props => (
              <img
                className='rounded-lg mx-auto my-large max-w-full max-h-[860px]'
                {...props}
              />
            ),
            a: props => (
              <a
                className='text-secondary underline hover:text-primary'
                target='_blank'
                rel='noopener noreferrer'
                {...props}
              />
            ),
            code: props => (
              <code
                className='bg-green-black text-sm px-xxsmall py-0.5 rounded'
                {...props}
              />
            ),
            pre: props => (
              <pre
                className='bg-green-black text-white p-base rounded mb-large overflow-x-auto'
                {...props}
              />
            ),
          }}
        />
      </div>
      <GiscusComments locale={locale} term={data.title} />
      <ScrollTopButton />
    </section>
  )
}

export default BlogPost
