import { ReactNode } from 'react'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

type ComponentProps = { children?: ReactNode; className?: string; href?: string }
type Components = Record<string, (props: ComponentProps) => ReactNode>

jest.mock('remark-gfm', () => ({ __esModule: true, default: () => null }))

// react-markdown is ESM-only, so the parser is replaced by a stub that renders
// every custom component the message declares.
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({
    components,
    children,
  }: {
    components: Components
    children: string
  }) => (
    <div data-testid='markdown'>
      <span data-testid='source'>{children}</span>
      {components.p({ children: 'paragraph' })}
      {components.a({ href: 'https://gabrielduete.com', children: 'link' })}
      {components.ul({ children: components.li({ children: 'bullet' }) })}
      {components.ol({ children: components.li({ children: 'numbered' }) })}
      {components.h1({ children: 'title one' })}
      {components.h2({ children: 'title two' })}
      {components.h3({ children: 'title three' })}
      {components.p({ children: components.strong({ children: 'bold' }) })}
      {components.p({ children: components.code({ children: 'inline code' }) })}
      {components.pre({
        children: components.code({
          className: 'language-ts',
          children: 'const a = 1',
        }),
      })}
      {components.blockquote({ children: 'quoted' })}
    </div>
  ),
}))

import MarkdownMessage from './MarkdownMessage'

describe('<MarkdownMessage />', () => {
  it('forwards the raw content to the markdown parser', () => {
    render(<MarkdownMessage content='# hello' />)

    expect(screen.getByTestId('source')).toHaveTextContent('# hello')
  })

  it('renders links opening in a new tab', () => {
    render(<MarkdownMessage content='content' />)

    const link = screen.getByRole('link', { name: 'link' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders headings, lists, quotes and emphasis', () => {
    render(<MarkdownMessage content='content' />)

    expect(screen.getByText('title one')).toBeInTheDocument()
    expect(screen.getByText('title two')).toBeInTheDocument()
    expect(screen.getByText('title three')).toBeInTheDocument()
    expect(screen.getByText('bullet')).toBeInTheDocument()
    expect(screen.getByText('numbered')).toBeInTheDocument()
    expect(screen.getByText('bold').tagName).toBe('STRONG')
    expect(screen.getByText('quoted').tagName).toBe('BLOCKQUOTE')
    expect(screen.getByText('paragraph').tagName).toBe('P')
  })

  it('renders inline code with the inline styles', () => {
    render(<MarkdownMessage content='content' />)

    const inline = screen.getByText('inline code')

    expect(inline.tagName).toBe('CODE')
    expect(inline).toHaveClass('rounded')
    expect(inline).not.toHaveClass('language-ts')
  })

  it('renders fenced code blocks keeping the language class', () => {
    render(<MarkdownMessage content='content' />)

    const block = screen.getByText('const a = 1')

    expect(block.tagName).toBe('CODE')
    expect(block.closest('pre')).toBeInTheDocument()
    expect(block).toHaveClass('language-ts')
  })
})
