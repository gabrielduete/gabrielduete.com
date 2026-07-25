import { fireEvent, render, screen } from '@testing-library/react'

const sendMessageMock = jest.fn()
type ChatMockReturn = { messages: unknown[]; sendMessage: jest.Mock; status: string }
const useChatMock = jest.fn<ChatMockReturn, [Record<string, unknown>]>(() => ({
  messages: [],
  sendMessage: sendMessageMock,
  status: 'ready',
}))
jest.mock('@ai-sdk/react', () => ({
  useChat: (opts: Record<string, unknown>) => useChatMock(opts),
}))
jest.mock('ai', () => ({ DefaultChatTransport: jest.fn() }))
jest.mock('./MarkdownMessage', () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => <div>{content}</div>,
}))
jest.mock('next/navigation', () => ({ usePathname: () => '/en/blog/post' }))
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

import ChatBot from '.'

describe('<ChatBot />', () => {
  beforeEach(() => {
    sendMessageMock.mockClear()
    useChatMock.mockClear()
    localStorage.clear()
  })

  it('is collapsed initially and opens the panel on click', () => {
    render(<ChatBot />)

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'open' }))

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('sends a message on submit', () => {
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: 'open' }))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.submit(input.closest('form')!)

    expect(sendMessageMock).toHaveBeenCalled()
  })

  it('restores chat history from localStorage on mount', () => {
    const savedMessages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'hello' }] },
      { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'hi there' }] },
    ]
    localStorage.setItem('chatbot-history', JSON.stringify(savedMessages))

    render(<ChatBot />)

    expect(useChatMock).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: savedMessages,
      }),
    )
  })

  it('persists at most 50 messages to localStorage when history exceeds the cap', () => {
    const manyMessages = Array.from({ length: 60 }, (_, i) => ({
      id: String(i),
      role: i % 2 === 0 ? 'user' : 'assistant',
      parts: [{ type: 'text', text: `msg ${i}` }],
    }))
    useChatMock.mockReturnValue({
      messages: manyMessages,
      sendMessage: sendMessageMock,
      status: 'ready',
    })

    render(<ChatBot />)

    const stored = localStorage.getItem('chatbot-history')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(50)
    // should be the LAST 50
    expect(parsed[0].id).toBe('10')
    expect(parsed[49].id).toBe('59')
  })
})
