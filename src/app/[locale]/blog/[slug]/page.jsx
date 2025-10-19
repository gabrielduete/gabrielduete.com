import ExternalLink from '@/app/[locale]/career/components/ExternalLink'
import BackButton from '@/components/BackButton'
import { GiscusComments } from '@/components/Giscus'
import ScrollTopButton from '@/components/ScrollTopButton'
import TabTitleWatcher from '@/components/TabTitleWatcher/TabTitleWatcher'
import { Paths } from '@/enums/Paths'
import { SocialMedia } from '@/enums/SocialMedia'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

import { getBlogData } from '../helpers/getDataContentFile'

export async function generateMetadata({ params }) {
  const { slug, locale } = await params
  const { data } = getBlogData(slug, locale)
  const { title, description, date, tags } = data

  const baseUrl = 'https://gabrielduete.com'
  const url = `${baseUrl}/${locale}/blog/${slug}`
  const imageUrl = `${baseUrl}/assets/images/post.jpg`

  return {
    title,
    description: description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Gabriel Duete',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale,
      type: 'article',
      publishedTime: date,
      authors: ['Gabriel Duete'],
      tags: tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@gabrielduetedev',
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
  const { title, description, date } = data

  return (
    <section className='text-blog'>
      <TabTitleWatcher originalTitle={title} />
      <BackButton path={Paths.BLOG} />
      <header>
        <h1 className='text-title-xgiant font-bold mb-xxsmall'>{title}</h1>
        <p className='text-subtitle-small text-gray-400'>{description}</p>
        <p className='text-xsmall text-gray-600 mb-large'>{date}</p>
      </header>
      <article>
        <MDXRemote
          source={content}
          components={{
            h1: props => (
              <h1
                className='text-title-giant font-bold mb-xxsmall mt-base'
                {...props}
              />
            ),
            h2: props => (
              <h2
                className='text-title-headline mt-small font-semibold'
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
            video: props => (
              <video
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
        <hr className='mt-large mb-large text-gray-600 w-10' />
        <h3 className='text-title-headline text-green-white'>
          Gostou do conteúdo? Aceito uma contribuição! :){' '}
        </h3>
        <p>PIX: gabrielmonteiroduete@gmail.com</p>
        <hr className='mt-large mb-large text-gray-600 w-10' />
        <h3 className='text-title-headline text-green-white'>
          Tem algo para acrescentar?
        </h3>
        <p>
          Esse blog é open source, então fique a vontade para fazer abrir um{' '}
          <ExternalLink href={`${SocialMedia.GITHUB}/gabrielduete.com`}>
            PR no repositório.
          </ExternalLink>
        </p>
        <hr className='mt-large mb-large text-gray-600 w-10' />
        <h3 className='text-title-headline text-green-white'>
          Me encontre também em:
        </h3>
        <ul className='list-disc pl-medium mb-base'>
          <li>
            GitHub:{' '}
            <ExternalLink href={SocialMedia.GITHUB}>@gabrielduete</ExternalLink>
          </li>
          <li>
            LinkedIn:{' '}
            <ExternalLink href={SocialMedia.LINKEDIN}>
              @gabrielduete
            </ExternalLink>
          </li>
          <li>
            DEV:{' '}
            <ExternalLink href={SocialMedia.DEV}>@gabrielduete</ExternalLink>
          </li>
          <li>
            Tabnews:{' '}
            <ExternalLink href={SocialMedia.TABNEWS}>
              @gabrielduete
            </ExternalLink>
          </li>
          <li>
            StackOverflow:{' '}
            <ExternalLink href={SocialMedia.STACKOVERFLOW}>
              @gabrielduete
            </ExternalLink>
          </li>
          <li>
            Beecrowd:{' '}
            <ExternalLink href={SocialMedia.BEECROWD}>
              @gabrielduete
            </ExternalLink>
          </li>
          <li>
            LeetCode:{' '}
            <ExternalLink href={SocialMedia.LEETCODE}>
              @gabrielduete
            </ExternalLink>
          </li>
        </ul>
      </article>
      <GiscusComments locale={locale} term={title} />
      <ScrollTopButton />
    </section>
  )
}

export default BlogPost
