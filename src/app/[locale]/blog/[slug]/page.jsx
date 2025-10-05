import Banner from '@/../public/assets/images/og-default.svg'
import BackButton from '@/components/BackButton'
import { GiscusComments } from '@/components/Giscus'
import ScrollTopButton from '@/components/ScrollTopButton'
import TabTitleWatcher from '@/components/TabTitleWatcher/TabTitleWatcher'
import { Paths } from '@/enums/Paths'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

import { getBlogData } from '../helpers/getDataContentFile'

export async function generateMetadata({ params }) {
  const { slug, locale } = await params
  const { data } = getBlogData(slug, locale)

  const baseUrl = 'https://gabrielduete.com'

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: `${baseUrl}/${locale}/blog/${slug}`,
      siteName: 'Gabriel Duete',
      images: [
        {
          url: Banner,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      locale: locale,
      type: 'article',
      publishedTime: data.date,
      authors: ['Gabriel Duete'],
      tags: data.tags || [],
    },
    alternates: {
      canonical: url,
    },
  }
}

const BlogPost = async ({ params }) => {
  if (!params) notFound()

  const { slug, locale } = await params
  const { content, data } = getBlogData(slug, locale)

  return (
    <section className='text-blog'>
      <TabTitleWatcher originalTitle={data.title} />
      <BackButton path={Paths.BLOG} />
      <h1 className='text-title-xgiant font-bold mb-xxsmall'>{data.title}</h1>
      <p className='text-subtitle-small text-gray-400'>{data.description}</p>
      <p className='text-xsmall text-gray-600 mb-large'>{data.date}</p>
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
                className='bg-green-black text-white text-sm px-xxsmall py-0.5 rounded'
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
