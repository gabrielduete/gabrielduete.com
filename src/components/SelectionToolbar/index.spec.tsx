import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ASK_BOT_EVENT } from '../ChatBot/askBot'
import SelectionToolbar from '.'

// Build a fake Selection whose range lives inside `container`.
const mockSelection = (text: string, container: Node) => {
  const range = {
    commonAncestorContainer: container,
    getBoundingClientRect: () => ({
      top: 100,
      left: 50,
      width: 40,
      height: 16,
    }),
  }
  return {
    toString: () => text,
    rangeCount: text ? 1 : 0,
    getRangeAt: () => range,
    removeAllRanges: jest.fn(),
  } as unknown as Selection
}

const writeText = jest.fn().mockResolvedValue(undefined)

beforeAll(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
})

afterEach(() => {
  jest.restoreAllMocks()
  writeText.mockClear()
  document.body.innerHTML = ''
})

const selectInsideArticle = (text: string) => {
  const article = document.createElement('article')
  const span = document.createElement('span')
  article.appendChild(span)
  document.body.appendChild(article)
  jest.spyOn(window, 'getSelection').mockReturnValue(mockSelection(text, span))
}

describe('<SelectionToolbar />', () => {
  it('shows the toolbar after selecting text inside an article', async () => {
    render(<SelectionToolbar />)
    selectInsideArticle('some passage')

    fireEvent.mouseUp(document)

    await waitFor(() =>
      expect(screen.getByRole('toolbar')).toBeInTheDocument(),
    )
    expect(screen.getByText('askBot')).toBeInTheDocument()
    expect(screen.getByText('copy')).toBeInTheDocument()
    expect(screen.getByText('share')).toBeInTheDocument()
  })

  it('does not show the toolbar when the selection is outside an article', async () => {
    render(<SelectionToolbar />)
    const span = document.createElement('span')
    document.body.appendChild(span)
    jest
      .spyOn(window, 'getSelection')
      .mockReturnValue(mockSelection('loose text', span))

    fireEvent.mouseUp(document)

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
  })

  it('dispatches the ask-bot event with the selected text', async () => {
    const received: string[] = []
    const handler = (event: Event) =>
      received.push((event as CustomEvent<string>).detail)
    window.addEventListener(ASK_BOT_EVENT, handler)

    render(<SelectionToolbar />)
    selectInsideArticle('explain me')
    fireEvent.mouseUp(document)
    await waitFor(() => screen.getByRole('toolbar'))

    fireEvent.click(screen.getByText('askBot'))

    window.removeEventListener(ASK_BOT_EVENT, handler)
    expect(received).toEqual(['explain me'])
  })

  it('copies the selected text to the clipboard', async () => {
    render(<SelectionToolbar />)
    selectInsideArticle('copy me')
    fireEvent.mouseUp(document)
    await waitFor(() => screen.getByRole('toolbar'))

    fireEvent.click(screen.getByText('copy'))

    expect(writeText).toHaveBeenCalledWith('copy me')
  })

  it('keeps the share submenu open after a mouseup inside the toolbar', async () => {
    render(<SelectionToolbar />)
    selectInsideArticle('great point')
    fireEvent.mouseUp(document)
    await waitFor(() => screen.getByRole('toolbar'))

    fireEvent.click(screen.getByText('share'))
    // a mouseup bubbling from inside the toolbar must not reset the submenu
    fireEvent.mouseUp(screen.getByRole('toolbar'))
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
  })

  it('opens the X compose intent with the snippet and post url', async () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null)
    render(<SelectionToolbar />)
    selectInsideArticle('great point')
    fireEvent.mouseUp(document)
    await waitFor(() => screen.getByRole('toolbar'))

    fireEvent.click(screen.getByText('share'))
    fireEvent.click(screen.getByText('X'))

    expect(open).toHaveBeenCalled()
    const url = open.mock.calls[0][0] as string
    expect(url).toContain('twitter.com/intent/tweet')
    expect(url).toContain(encodeURIComponent('"great point"'))
  })

  it('hides the toolbar when the selection is cleared', async () => {
    render(<SelectionToolbar />)
    selectInsideArticle('temporary')
    fireEvent.mouseUp(document)
    await waitFor(() => screen.getByRole('toolbar'))

    jest.spyOn(window, 'getSelection').mockReturnValue(mockSelection('', document.body))
    fireEvent.mouseUp(document)

    await waitFor(() =>
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument(),
    )
  })

  it('hides the toolbar when the browser reports an empty selection', async () => {
    render(<SelectionToolbar />)
    selectInsideArticle('temporary')
    fireEvent.mouseUp(document)
    await waitFor(() => screen.getByRole('toolbar'))

    jest.spyOn(window, 'getSelection').mockReturnValue(null)
    fireEvent(document, new Event('selectionchange'))

    await waitFor(() =>
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument(),
    )
  })

  it('hides the toolbar when the page scrolls', async () => {
    render(<SelectionToolbar />)
    selectInsideArticle('temporary')
    fireEvent.mouseUp(document)
    await waitFor(() => screen.getByRole('toolbar'))

    fireEvent.scroll(window)

    await waitFor(() =>
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument(),
    )
  })

  it('hides the toolbar when the window is resized', async () => {
    render(<SelectionToolbar />)
    selectInsideArticle('temporary')
    fireEvent.mouseUp(document)
    await waitFor(() => screen.getByRole('toolbar'))

    fireEvent(window, new Event('resize'))

    await waitFor(() =>
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument(),
    )
  })

  it('keeps the selection alive on mousedown inside the toolbar', async () => {
    render(<SelectionToolbar />)
    selectInsideArticle('great point')
    fireEvent.mouseUp(document)
    await waitFor(() => screen.getByRole('toolbar'))

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    })
    fireEvent(screen.getByRole('toolbar'), event)

    expect(event.defaultPrevented).toBe(true)
  })

  it('shows the copied feedback and dismisses itself', async () => {
    jest.useFakeTimers()

    render(<SelectionToolbar />)
    selectInsideArticle('copy me')
    fireEvent.mouseUp(document)
    act(() => jest.advanceTimersByTime(1))
    await waitFor(() => screen.getByRole('toolbar'))

    fireEvent.click(screen.getByText('copy'))
    await waitFor(() => expect(screen.getByText('copied')).toBeInTheDocument())

    act(() => jest.advanceTimersByTime(1000))

    await waitFor(() =>
      expect(screen.queryByRole('toolbar')).not.toBeInTheDocument(),
    )

    jest.useRealTimers()
  })

  it('still shows the feedback when the clipboard is unavailable', async () => {
    writeText.mockRejectedValueOnce(new Error('denied'))

    render(<SelectionToolbar />)
    selectInsideArticle('copy me')
    fireEvent.mouseUp(document)
    await waitFor(() => screen.getByRole('toolbar'))

    fireEvent.click(screen.getByText('copy'))

    await waitFor(() => expect(screen.getByText('copied')).toBeInTheDocument())
  })

  it('clears the pending dismiss timer on unmount', async () => {
    jest.useFakeTimers()
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout')

    const { unmount } = render(<SelectionToolbar />)
    selectInsideArticle('copy me')
    fireEvent.mouseUp(document)
    act(() => jest.advanceTimersByTime(1))
    await waitFor(() => screen.getByRole('toolbar'))

    fireEvent.click(screen.getByText('copy'))
    await waitFor(() => expect(screen.getByText('copied')).toBeInTheDocument())

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()

    jest.useRealTimers()
  })

  it('opens the LinkedIn share when choosing LinkedIn', async () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null)
    render(<SelectionToolbar />)
    selectInsideArticle('great point')
    fireEvent.mouseUp(document)
    await waitFor(() => screen.getByRole('toolbar'))

    fireEvent.click(screen.getByText('share'))
    fireEvent.click(screen.getByText('LinkedIn'))

    expect(open).toHaveBeenCalled()
    const url = open.mock.calls[0][0] as string
    expect(url).toContain('linkedin.com/feed')
    expect(url).toContain(encodeURIComponent('"great point"'))
  })
})
