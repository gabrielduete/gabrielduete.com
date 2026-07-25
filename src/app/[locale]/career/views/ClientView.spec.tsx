import { ReactNode, createElement } from 'react'

import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import ClientView from './ClientView'

const pushMock = jest.fn()
let currentParams = new URLSearchParams()
let currentLocale = 'en'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: jest.fn() }),
  usePathname: () => '/en/career',
  useSearchParams: () => currentParams,
}))

const contributionsByExperience: Record<string, number> = {
  Petlove: 1,
  'Juntos Somos Mais': 7,
  'Nimbus Black': 1,
  React4Noobs: 2,
  'He4rt Team': 1,
}

type RichHandlers = {
  atomium: (chunks: ReactNode) => ReactNode
  a: (chunks: ReactNode) => ReactNode
}

const richNodes: Record<string, ReactNode> = {
  '1': 'https://one.com',
  '2': ['https://', 'two.com'] as unknown as ReactNode,
  '3': createElement('span', null, 'https://three.com'),
  '4': 42 as unknown as ReactNode,
}

jest.mock('next-intl', () => ({
  useLocale: () => currentLocale,
  useTranslations: () => {
    const t = (key: string) => {
      const totalMatch = key.match(/^Experiences\.(.+)\.totalContributions$/)
      if (totalMatch) return String(contributionsByExperience[totalMatch[1]] ?? 1)

      if (key === 'Experiences.Petlove.link') return 'https://www.petlove.com.br/'
      if (key.endsWith('.link')) return ''

      return key
    }

    t.rich = (key: string, handlers: RichHandlers) => {
      const contribution = key.split('.').pop() as string

      if (contribution === '5') return handlers.atomium('atomium')

      return handlers.a(richNodes[contribution] ?? 'https://fallback.com')
    }

    return t
  },
}))

const setParams = (search: string) => {
  currentParams = new URLSearchParams(search)
}

const findDots = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('[data-timeline-dot]'))

describe('<CarrerView />', () => {
  beforeEach(() => {
    pushMock.mockClear()
    setParams('')
    currentLocale = 'en'
    window.scrollBy = jest.fn()

    global.ResizeObserver = class {
      observe = jest.fn()
      unobserve = jest.fn()
      disconnect = jest.fn()
    } as unknown as typeof ResizeObserver
  })

  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia
  })

  it('renders every experience collapsed when there is no filter in the url', () => {
    render(<ClientView />)

    expect(
      screen.getByRole('button', { name: 'Petlove' }),
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('pre-selects the experience coming from the url filter param', () => {
    setParams('filter=Juntos-Somos-Mais')

    render(<ClientView />)

    expect(
      screen.getByRole('button', { name: 'Juntos Somos Mais' }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  it('pre-selects the experience when the url filter uses spaces', () => {
    setParams('filter=Nimbus Black')

    render(<ClientView />)

    expect(
      screen.getByRole('button', { name: 'Nimbus Black' }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  it('ignores an unknown filter param', () => {
    setParams('filter=not-an-experience')

    render(<ClientView />)

    expect(
      screen.getByRole('button', { name: 'Petlove' }),
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('pre-selects the type filter coming from the url', () => {
    setParams('type=freelance')

    render(<ClientView />)

    expect(screen.getByRole('button', { name: 'Nimbus Black' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Petlove' })).not.toBeInTheDocument()
  })

  it('falls back to the "all" type filter when the url value is unknown', () => {
    setParams('type=unknown')

    render(<ClientView />)

    expect(screen.getByRole('button', { name: 'Petlove' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nimbus Black' })).toBeInTheDocument()
  })

  it('pushes the selected experience to the url when expanding', () => {
    render(<ClientView />)

    fireEvent.click(screen.getByRole('button', { name: 'Nimbus Black' }))

    expect(pushMock).toHaveBeenCalledWith('?filter=Nimbus-Black')
  })

  it('removes the filter from the url when collapsing the selected experience', () => {
    render(<ClientView />)

    const button = screen.getByRole('button', { name: 'Nimbus Black' })
    fireEvent.click(button)
    pushMock.mockClear()
    fireEvent.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(pushMock).toHaveBeenLastCalledWith('?')
  })

  it('expands the experience when its timeline dot is clicked', () => {
    const { container } = render(<ClientView />)

    fireEvent.click(findDots(container)[0])

    expect(
      screen.getByRole('button', { name: 'Petlove' }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  it('animates the scroll to the focused card until the duration elapses', () => {
    render(<ClientView />)

    const startedAt = performance.now()
    let frame = 0
    const rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(callback => {
        frame += 1
        callback(startedAt + frame * 400)
        return frame
      })

    fireEvent.click(screen.getByRole('button', { name: 'Petlove' }))

    expect(rafSpy).toHaveBeenCalledTimes(2)
    expect(window.scrollBy).toHaveBeenCalled()

    rafSpy.mockRestore()
  })

  it('jumps straight to the card when the user prefers reduced motion', () => {
    window.matchMedia = jest.fn().mockReturnValue({ matches: true })

    render(<ClientView />)
    fireEvent.click(screen.getByRole('button', { name: 'Petlove' }))

    expect(window.scrollBy).toHaveBeenCalledWith(0, -100)
  })

  it('syncs the selected experience when the url filter changes', () => {
    const { rerender } = render(<ClientView />)

    setParams('filter=React4Noobs')
    rerender(<ClientView />)

    expect(
      screen.getByRole('button', { name: 'React4Noobs' }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  it('filters the experiences by type and pushes the type to the url', () => {
    render(<ClientView />)

    fireEvent.click(screen.getByRole('button', { name: 'Filters.open-source' }))

    expect(pushMock).toHaveBeenCalledWith('?type=open-source')
    expect(screen.getByRole('button', { name: 'React4Noobs' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Petlove' })).not.toBeInTheDocument()
  })

  it('removes the type from the url when going back to "all"', () => {
    setParams('type=freelance')

    render(<ClientView />)
    fireEvent.click(screen.getByRole('button', { name: 'Filters.all' }))

    expect(pushMock).toHaveBeenLastCalledWith('?')
    expect(screen.getByRole('button', { name: 'Petlove' })).toBeInTheDocument()
  })

  it('clears the selected experience when the new type filter hides it', () => {
    render(<ClientView />)

    fireEvent.click(screen.getByRole('button', { name: 'Petlove' }))
    pushMock.mockClear()

    fireEvent.click(screen.getByRole('button', { name: 'Filters.freelance' }))

    expect(pushMock).toHaveBeenLastCalledWith('?type=freelance')
    expect(
      screen.getByRole('button', { name: 'Nimbus Black' }),
    ).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps the selected experience when the new type filter still shows it', () => {
    render(<ClientView />)

    fireEvent.click(screen.getByRole('button', { name: 'Petlove' }))
    fireEvent.click(screen.getByRole('button', { name: 'Filters.full-time' }))

    expect(
      screen.getByRole('button', { name: 'Petlove' }),
    ).toHaveAttribute('aria-expanded', 'true')
  })

  it('tracks the pointer position on the card for the spotlight effect', () => {
    const { container } = render(<ClientView />)

    const card = container.querySelector('.spotlight-card') as HTMLElement
    fireEvent.mouseMove(card, { clientX: 30, clientY: 12 })

    expect(card.style.getPropertyValue('--mouse-x')).toBe('30px')
    expect(card.style.getPropertyValue('--mouse-y')).toBe('12px')
  })

  it('toggles the extra contributions of an experience', () => {
    render(<ClientView />)

    fireEvent.click(screen.getByRole('button', { name: 'Juntos Somos Mais' }))

    const showMore = screen.getByRole('button', { name: 'Show more (+2)' })
    fireEvent.click(showMore)

    expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Show less' }))

    expect(screen.getByRole('button', { name: 'Show more (+2)' })).toBeInTheDocument()
  })

  it('resets the expanded contributions when the experience is collapsed', () => {
    render(<ClientView />)

    const experience = screen.getByRole('button', { name: 'Juntos Somos Mais' })
    fireEvent.click(experience)
    fireEvent.click(screen.getByRole('button', { name: 'Show more (+2)' }))
    fireEvent.click(experience)
    fireEvent.click(experience)

    expect(screen.getByRole('button', { name: 'Show more (+2)' })).toBeInTheDocument()
  })

  it('renders the show more label in portuguese', () => {
    currentLocale = 'pt-br'

    render(<ClientView />)
    fireEvent.click(screen.getByRole('button', { name: 'Juntos Somos Mais' }))

    expect(screen.getByRole('button', { name: 'Ver mais (+2)' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Ver mais (+2)' }))

    expect(screen.getByRole('button', { name: 'Ver menos' })).toBeInTheDocument()
  })

  it('renders the learn more link only for experiences that have one', () => {
    render(<ClientView />)

    fireEvent.click(screen.getByRole('button', { name: 'Petlove' }))

    expect(
      screen.getByRole('link', { name: '👉 Learn more' }),
    ).toHaveAttribute('href', 'https://www.petlove.com.br/')
  })

  it('renders the learn more link in portuguese', () => {
    currentLocale = 'pt-br'

    render(<ClientView />)
    fireEvent.click(screen.getByRole('button', { name: 'Petlove' }))

    expect(screen.getByRole('link', { name: '👉 Saiba Mais' })).toBeInTheDocument()
  })

  it('turns every contribution chunk shape into an external link', () => {
    render(<ClientView />)

    fireEvent.click(screen.getByRole('button', { name: 'Juntos Somos Mais' }))
    fireEvent.click(screen.getByRole('button', { name: 'Show more (+2)' }))

    const hrefs = screen
      .getAllByRole('link')
      .map(link => link.getAttribute('href'))

    expect(hrefs).toEqual(
      expect.arrayContaining([
        'https://one.com',
        'https://two.com',
        'https://three.com',
        '42',
        'https://github.com/juntossomosmais/atomium',
      ]),
    )
  })

  it('works when ResizeObserver is not available', () => {
    const original = global.ResizeObserver
    // @ts-expect-error forcing the environment without ResizeObserver
    delete global.ResizeObserver

    expect(() => render(<ClientView />)).not.toThrow()

    global.ResizeObserver = original
  })
})
