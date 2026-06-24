import { fireEvent, render, screen } from '@testing-library/react'

const sendMessageMock = jest.fn()
const useChatMock = jest.fn((opts: any) => ({
  messages: [],
  sendMessage: sendMessageMock,
  status: 'ready',
}))
jest.mock('@ai-sdk/react', () => ({
  useChat: (opts: any) => useChatMock(opts),
}))
jest.mock('ai', () => ({ DefaultChatTransport: jest.fn() }))
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
})
