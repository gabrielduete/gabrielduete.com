'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = {
  content: string
}

// Renders an assistant message as formatted markdown, styled to match the
// chat panel (dark surface, green accents). Links open in a new tab.
const MarkdownMessage = ({ content }: Props) => (
  <div className='space-y-2 text-sm leading-relaxed break-words'>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: props => <p className='mb-2 last:mb-0' {...props} />,
        a: props => (
          <a
            className='text-secondary underline underline-offset-2 hover:text-primary'
            target='_blank'
            rel='noopener noreferrer'
            {...props}
          />
        ),
        ul: props => (
          <ul className='mb-2 list-disc space-y-1 pl-4 last:mb-0' {...props} />
        ),
        ol: props => (
          <ol className='mb-2 list-decimal space-y-1 pl-4 last:mb-0' {...props} />
        ),
        li: props => <li className='marker:text-gray-500' {...props} />,
        strong: props => <strong className='font-semibold text-white' {...props} />,
        h1: props => <h2 className='mb-1 mt-2 text-base font-semibold' {...props} />,
        h2: props => <h2 className='mb-1 mt-2 text-base font-semibold' {...props} />,
        h3: props => <h3 className='mb-1 mt-2 text-sm font-semibold' {...props} />,
        code: props => {
          const { children, className } = props
          const isBlock = (className || '').includes('language-')
          if (isBlock) {
            return (
              <code
                className='block overflow-x-auto rounded-md bg-black/50 p-2 font-mono text-xs'
                {...props}
              />
            )
          }
          return (
            <code className='rounded bg-black/50 px-1 py-0.5 font-mono text-xs'>
              {children}
            </code>
          )
        },
        pre: props => <pre className='mb-2 last:mb-0' {...props} />,
        blockquote: props => (
          <blockquote
            className='border-l-2 border-gray-600 pl-3 text-gray-300 italic'
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
)

export default MarkdownMessage
