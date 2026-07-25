import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'

const sendMessageMock = jest.fn()
const regenerateMock = jest.fn()

type ChatMockReturn = {
  messages: unknown[]
  sendMessage: jest.Mock
  status: string
  error?: Error
  regenerate: jest.Mock
}

const useChatMock = jest.fn<ChatMockReturn, [Record<string, unknown>]>(() => ({
  messages: [],
  sendMessage: sendMessageMock,
  status: 'ready',
  regenerate: regenerateMock,
}))

const transportMock = jest.fn()

jest.mock('@ai-sdk/react', () => ({
  useChat: (opts: Record<string, unknown>) => useChatMock(opts),
}))
jest.mock('ai', () => ({
  DefaultChatTransport: jest.fn(config => transportMock(config)),
}))
jest.mock('./MarkdownMessage', () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => (
    <div data-testid='markdown'>{content}</div>
  ),
}))

let currentPathname = '/en/blog/post'
jest.mock('next/navigation', () => ({ usePathname: () => currentPathname }))
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, string>) =>
    values ? `${key}:${values.snippet}` : key,
}))

import ChatBot from '.'
import { ASK_BOT_EVENT } from './askBot'

const openPanel = () =>
  fireEvent.click(screen.getByRole('button', { name: 'open' }))

const defaultChat = (): ChatMockReturn => ({
  messages: [],
  sendMessage: sendMessageMock,
  status: 'ready',
  regenerate: regenerateMock,
})

describe('<ChatBot />', () => {
  beforeEach(() => {
    sendMessageMock.mockClear()
    regenerateMock.mockClear()
    transportMock.mockClear()
    useChatMock.mockClear()
    useChatMock.mockImplementation(defaultChat)
    currentPathname = '/en/blog/post'
    localStorage.clear()
  })

  it('is collapsed initially and opens the panel on click', () => {
    render(<ChatBot />)

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    openPanel()

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('empty')).toBeInTheDocument()
  })

  it('closes the panel again', () => {
    render(<ChatBot />)
    openPanel()

    fireEvent.click(screen.getByRole('button', { name: 'close' }))

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('sends the current post context on every request', () => {
    render(<ChatBot />)

    const { body } = transportMock.mock.calls[0][0]
    expect(body()).toEqual({ currentSlug: 'post', locale: 'en' })
  })

  it('sends a message on submit and clears the input', () => {
    render(<ChatBot />)
    openPanel()

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.submit(input.closest('form')!)

    expect(sendMessageMock).toHaveBeenCalledWith({ text: 'hello' })
    expect(input).toHaveValue('')
  })

  it('sends a message when pressing Enter', () => {
    render(<ChatBot />)
    openPanel()

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(sendMessageMock).toHaveBeenCalledWith({ text: 'hello' })
  })

  it('does not send on Shift+Enter', () => {
    render(<ChatBot />)
    openPanel()

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })

    expect(sendMessageMock).not.toHaveBeenCalled()
  })

  it('ignores an empty submit', () => {
    render(<ChatBot />)
    openPanel()

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.submit(input.closest('form')!)

    expect(sendMessageMock).not.toHaveBeenCalled()
  })

  it('ignores a submit while the model is answering', () => {
    useChatMock.mockImplementation(() => ({
      ...defaultChat(),
      status: 'streaming',
    }))

    render(<ChatBot />)
    openPanel()

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.submit(input.closest('form')!)

    expect(sendMessageMock).not.toHaveBeenCalled()
  })

  it('renders user messages as plain text and assistant ones as markdown', () => {
    useChatMock.mockImplementation(() => ({
      ...defaultChat(),
      messages: [
        {
          id: '1',
          role: 'user',
          parts: [
            { type: 'text', text: 'hel' },
            { type: 'step-start' },
            { type: 'text', text: 'lo' },
          ],
        },
        {
          id: '2',
          role: 'assistant',
          parts: [{ type: 'text', text: '**hi**' }],
        },
      ],
    }))

    render(<ChatBot />)
    openPanel()

    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByTestId('markdown')).toHaveTextContent('**hi**')
  })

  it('shows the typing indicator while the model is answering', () => {
    useChatMock.mockImplementation(() => ({
      ...defaultChat(),
      status: 'submitted',
    }))

    const { container } = render(<ChatBot />)
    openPanel()

    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument()
  })

  it('offers a retry when the request fails', () => {
    useChatMock.mockImplementation(() => ({
      ...defaultChat(),
      error: new Error('boom'),
    }))

    const { container } = render(<ChatBot />)
    openPanel()

    expect(
      container.querySelector('[aria-live="assertive"]'),
    ).toHaveTextContent('error')

    fireEvent.click(screen.getByRole('button', { name: 'retry' }))

    expect(regenerateMock).toHaveBeenCalled()
  })

  it('opens and asks the model when the selection toolbar dispatches an event', () => {
    render(<ChatBot />)

    act(() => {
      window.dispatchEvent(
        new CustomEvent(ASK_BOT_EVENT, { detail: ' selected text ' }),
      )
    })

    expect(sendMessageMock).toHaveBeenCalledWith({
      text: 'askAboutSnippet:selected text',
    })
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('ignores an empty snippet event', () => {
    render(<ChatBot />)

    act(() => {
      window.dispatchEvent(new CustomEvent(ASK_BOT_EVENT, { detail: '  ' }))
    })

    expect(sendMessageMock).not.toHaveBeenCalled()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('grows the textarea as the content wraps', () => {
    render(<ChatBot />)
    openPanel()

    const input = screen.getByRole('textbox') as HTMLTextAreaElement
    Object.defineProperty(input, 'scrollHeight', {
      configurable: true,
      value: 300,
    })

    fireEvent.change(input, { target: { value: 'a long message' } })

    expect(input.style.height).toBe('120px')
  })

  it('keeps the message list scrolled to the bottom', () => {
    const scrollTo = jest.fn()
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      writable: true,
      value: scrollTo,
    })

    render(<ChatBot />)
    openPanel()

    expect(scrollTo).toHaveBeenCalled()

    delete (HTMLElement.prototype as { scrollTo?: unknown }).scrollTo
  })

  it('restores chat history from localStorage on mount', () => {
    const savedMessages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'hello' }] },
      {
        id: '2',
        role: 'assistant',
        parts: [{ type: 'text', text: 'hi there' }],
      },
    ]
    localStorage.setItem('chatbot-history', JSON.stringify(savedMessages))

    render(<ChatBot />)

    expect(useChatMock).toHaveBeenCalledWith(
      expect.objectContaining({ messages: savedMessages }),
    )
  })

  it('starts empty when the persisted history is corrupted', () => {
    localStorage.setItem('chatbot-history', 'not json')

    render(<ChatBot />)

    expect(useChatMock).toHaveBeenCalledWith(
      expect.objectContaining({ messages: [] }),
    )
  })

  it('persists at most 50 messages to localStorage when history exceeds the cap', () => {
    const manyMessages = Array.from({ length: 60 }, (_, i) => ({
      id: String(i),
      role: i % 2 === 0 ? 'user' : 'assistant',
      parts: [{ type: 'text', text: `msg ${i}` }],
    }))
    useChatMock.mockImplementation(() => ({
      ...defaultChat(),
      messages: manyMessages,
    }))

    render(<ChatBot />)

    const stored = localStorage.getItem('chatbot-history')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(50)
    expect(parsed[0].id).toBe('10')
    expect(parsed[49].id).toBe('59')
  })

  it('ignores storage quota errors while persisting', () => {
    const setItem = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded')
      })
    useChatMock.mockImplementation(() => ({
      ...defaultChat(),
      messages: [{ id: '1', role: 'user', parts: [{ type: 'text', text: 'a' }] }],
    }))

    expect(() => render(<ChatBot />)).not.toThrow()

    setItem.mockRestore()
  })
})
