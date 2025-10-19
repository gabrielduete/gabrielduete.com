import { Paths } from '@/enums/Paths'
import { render, screen } from '@testing-library/react'
import { notFound } from 'next/navigation'

import { getBlogData } from '../helpers/getDataContentFile'
import BlogPost, { generateMetadata } from './page'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(() => {
    const mockT = jest.fn(key => `translated_${key}`)
    mockT.rich = jest.fn((key, values) => `translated_${key}`)
    return mockT
  }),
}))

jest.mock('../helpers/getDataContentFile', () => ({
  getBlogData: jest.fn(),
}))

jest.mock('@/components/BackButton', () => {
  return function MockBackButton({ path }) {
    return <div data-testid='back-button'>{path}</div>
  }
})

jest.mock('@/components/Giscus', () => ({
  GiscusComments: function MockGiscusComments({ locale, term }) {
    return <div data-testid='giscus' data-locale={locale} data-term={term} />
  },
}))

jest.mock('@/components/ScrollTopButton', () => {
  return function MockScrollTopButton() {
    return <div data-testid='scroll-top-button' />
  }
})

jest.mock('@/components/TabTitleWatcher/TabTitleWatcher', () => {
  return function MockTabTitleWatcher({ originalTitle }) {
    return <div data-testid='tab-title-watcher' data-title={originalTitle} />
  }
})

jest.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: function MockMDXRemote({ source, components }) {
    return <div data-testid='mdx-remote' data-source={source} />
  },
}))

describe('BlogPost', () => {
  const mockGetBlogData = getBlogData
  const mockNotFound = notFound

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render blog post with correct data', async () => {
    const mockData = {
      title: 'Test Blog Post',
      description: 'Test description',
      date: '2024-01-01',
    }
    const mockContent = '# Test Content'

    mockGetBlogData.mockReturnValue({
      content: mockContent,
      data: mockData,
    })

    const params = { slug: 'test-post', locale: 'en' }
    const BlogPostComponent = await BlogPost({ params })

    render(BlogPostComponent)

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
    expect(screen.getByTestId('back-button')).toHaveTextContent(Paths.BLOG)
    expect(screen.getByTestId('tab-title-watcher')).toHaveAttribute(
      'data-title',
      'Test Blog Post',
    )
    expect(screen.getByTestId('giscus')).toHaveAttribute('data-locale', 'en')
    expect(screen.getByTestId('giscus')).toHaveAttribute(
      'data-term',
      'Test Blog Post',
    )
    expect(screen.getByTestId('scroll-top-button')).toBeInTheDocument()
    expect(screen.getByTestId('mdx-remote')).toHaveAttribute(
      'data-source',
      mockContent,
    )
  })

  it('should call notFound when params is null', async () => {
    try {
      await BlogPost({ params: null })
    } catch (error) {
      // Expected to throw due to destructuring
    }

    expect(mockNotFound).toHaveBeenCalled()
  })

  it('should call notFound when params is undefined', async () => {
    try {
      await BlogPost({ params: undefined })
    } catch (error) {
      // Expected to throw due to destructuring
    }

    expect(mockNotFound).toHaveBeenCalled()
  })

  it('should render with different locale', async () => {
    const mockData = {
      title: 'Post de Teste',
      description: 'Descrição de teste',
      date: '2024-01-01',
    }
    const mockContent = '# Conteúdo de Teste'

    mockGetBlogData.mockReturnValue({
      content: mockContent,
      data: mockData,
    })

    const params = { slug: 'post-teste', locale: 'pt-br' }
    const BlogPostComponent = await BlogPost({ params })

    render(BlogPostComponent)

    expect(screen.getByText('Post de Teste')).toBeInTheDocument()
    expect(screen.getByText('Descrição de teste')).toBeInTheDocument()
    expect(screen.getByTestId('giscus')).toHaveAttribute('data-locale', 'pt-br')
    expect(screen.getByTestId('giscus')).toHaveAttribute(
      'data-term',
      'Post de Teste',
    )
  })

  it('should have correct CSS classes', async () => {
    const mockData = {
      title: 'Test Post',
      description: 'Test description',
      date: '2024-01-01',
    }

    mockGetBlogData.mockReturnValue({
      content: '# Content',
      data: mockData,
    })

    const params = { slug: 'test-post', locale: 'en' }
    const BlogPostComponent = await BlogPost({ params })

    render(BlogPostComponent)

    const title = screen.getByText('Test Post')
    expect(title).toHaveClass('text-title-xgiant', 'font-bold', 'mb-xxsmall')

    const description = screen.getByText('Test description')
    expect(description).toHaveClass('text-subtitle-small', 'text-gray-400')

    const date = screen.getByText('2024-01-01')
    expect(date).toHaveClass('text-xsmall', 'text-gray-600', 'mb-large')
  })

  it('should call getBlogData with correct parameters', async () => {
    const mockData = {
      title: 'Test Post',
      description: 'Test description',
      date: '2024-01-01',
    }

    mockGetBlogData.mockReturnValue({
      content: '# Content',
      data: mockData,
    })

    const params = { slug: 'test-post', locale: 'en' }
    await BlogPost({ params })

    expect(mockGetBlogData).toHaveBeenCalledWith('test-post', 'en')
  })
})

describe('generateMetadata', () => {
  const mockGetBlogData = getBlogData

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should generate metadata with correct title and description', async () => {
    const mockData = {
      title: 'Test Blog Post',
      description: 'Test description',
    }

    mockGetBlogData.mockReturnValue({
      data: mockData,
    })

    const params = { slug: 'test-post', locale: 'en' }
    const metadata = await generateMetadata({ params })

    expect(mockGetBlogData).toHaveBeenCalledWith('test-post', 'en')
    expect(metadata).toEqual({
      title: 'Test Blog Post',
      description: 'Test description',
      openGraph: {
        title: 'Test Blog Post',
        description: 'Test description',
        url: 'https://gabrielduete.com/en/blog/test-post',
        siteName: 'Gabriel Duete',
        images: [
          {
            url: 'https://gabrielduete.com/assets/images/post.jpg',
            width: 1200,
            height: 630,
            alt: 'Test Blog Post',
          },
        ],
        locale: 'en',
        type: 'article',
        publishedTime: undefined,
        authors: ['Gabriel Duete'],
        tags: [],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Test Blog Post',
        description: 'Test description',
        images: ['https://gabrielduete.com/assets/images/post.jpg'],
        creator: '@gabrielduetedev',
      },
      alternates: {
        canonical: 'https://gabrielduete.com/en/blog/test-post',
      },
    })
  })

  it('should generate metadata for different locale', async () => {
    const mockData = {
      title: 'Post de Teste',
      description: 'Descrição de teste',
    }

    mockGetBlogData.mockReturnValue({
      data: mockData,
    })

    const params = { slug: 'post-teste', locale: 'pt-br' }
    const metadata = await generateMetadata({ params })

    expect(mockGetBlogData).toHaveBeenCalledWith('post-teste', 'pt-br')
    expect(metadata).toEqual({
      title: 'Post de Teste',
      description: 'Descrição de teste',
      openGraph: {
        title: 'Post de Teste',
        description: 'Descrição de teste',
        url: 'https://gabrielduete.com/pt-br/blog/post-teste',
        siteName: 'Gabriel Duete',
        images: [
          {
            url: 'https://gabrielduete.com/assets/images/post.jpg',
            width: 1200,
            height: 630,
            alt: 'Post de Teste',
          },
        ],
        locale: 'pt-br',
        type: 'article',
        publishedTime: undefined,
        authors: ['Gabriel Duete'],
        tags: [],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Post de Teste',
        description: 'Descrição de teste',
        images: ['https://gabrielduete.com/assets/images/post.jpg'],
        creator: '@gabrielduetedev',
      },
      alternates: {
        canonical: 'https://gabrielduete.com/pt-br/blog/post-teste',
      },
    })
  })
})
