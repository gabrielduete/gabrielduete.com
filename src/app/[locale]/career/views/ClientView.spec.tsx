import en from '@/messages/en.json'
import ptBr from '@/messages/pt-br.json'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, within } from '@testing-library/react'

import { experiences } from '../data'
import ClientView from './ClientView'

type Messages = Record<string, unknown>

type ExperienceMessages = {
  groups: Record<string, { items: Record<string, string> }>
}

let currentMessages: Messages = en

const resolve = (path: string): string => {
  const value = path
    .split('.')
    .reduce<unknown>(
      (node, segment) => (node as Messages | undefined)?.[segment],
      currentMessages,
    )

  if (typeof value !== 'string') {
    throw new Error(`Missing message: ${path}`)
  }

  return value
}

const format = (message: string, values: Record<string, unknown> = {}) =>
  message
    .replace(
      /\{(\w+), plural, one \{([^}]*)\} other \{([^}]*)\}\}/g,
      (_, name, one, other) =>
        (values[name] === 1 ? one : other).replace('#', String(values[name])),
    )
    .replace(/\{(\w+)\}/g, (_, name) => String(values[name]))

jest.mock('next-intl', () => ({
  useTranslations:
    (namespace: string) => (key: string, values?: Record<string, unknown>) =>
      format(resolve(`${namespace}.${key}`), values),
}))

const pushMock = jest.fn()
let currentParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: jest.fn() }),
  usePathname: () => '/en/career',
  useSearchParams: () => currentParams,
}))

const renderView = (locale = 'en') => {
  currentMessages = locale === 'en' ? en : ptBr

  return render(<ClientView />)
}

const getFeed = () =>
  screen.getByRole('region', { name: 'Experience' }).querySelector('ol')!

const getExperienceIds = () =>
  Array.from(getFeed().children).map(item => item.id.replace('experience-', ''))

const getToggle = (company: RegExp) =>
  within(getFeed()).getByRole('button', { name: company })

describe('<ClientView />', () => {
  beforeEach(() => {
    pushMock.mockClear()
    currentParams = new URLSearchParams()
    window.history.replaceState(null, '', '/')
  })

  it('should group the experiences by type, each ordered by period', () => {
    renderView()

    expect(getExperienceIds()).toEqual([
      'petlove',
      'juntos-somos-mais',
      'nimbus-black',
      'react4noobs',
      'he4rt-team',
      'open-source',
    ])
  })

  it('should render every contribution of every experience', () => {
    renderView()

    const total = experiences.reduce(
      (sum, experience) =>
        sum +
        experience.groups.reduce((acc, group) => acc + group.items.length, 0),
      0,
    )

    const items = experiences.flatMap(experience =>
      experience.groups.flatMap(group =>
        group.items.map(
          item =>
            (en.CarrerPage.Experiences as Record<string, ExperienceMessages>)[
              experience.id
            ].groups[group.key].items[item.key],
        ),
      ),
    )

    expect(items).toHaveLength(total)
    items.forEach(text =>
      expect(screen.getAllByText(text).length).toBeGreaterThan(0),
    )
  })

  it('should resolve every message in both locales', () => {
    expect(() => renderView('pt-br')).not.toThrow()
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: /^Open Source & Comunidade/,
      }),
    ).toBeInTheDocument()
  })

  it('should render the highlights with links to the experiences', () => {
    renderView()

    const highlights = screen.getByRole('region', { name: 'Highlights' })

    expect(within(highlights).getByText('−80%')).toBeInTheDocument()
    expect(within(highlights).getByText('−91%')).toBeInTheDocument()
    expect(within(highlights).getByText('Atomium')).toBeInTheDocument()
    expect(within(highlights).getByText('DevSecOps & AI')).toBeInTheDocument()
    expect(
      within(highlights).getByRole('link', { name: /Issue #32494/ }),
    ).toHaveAttribute('href', 'https://github.com/nuxt/nuxt/issues/32494')
    expect(
      within(highlights).getByRole('link', {
        name: /See experience\s?: Petlove/,
      }),
    ).toHaveAttribute('href', '#experience-petlove')
  })

  it('should filter by type and sync the url', () => {
    renderView()

    fireEvent.click(screen.getByRole('button', { name: /Full-time/ }))

    expect(getExperienceIds()).toEqual(['petlove', 'juntos-somos-mais'])
    expect(screen.getByRole('button', { name: /Full-time/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByText('2 experiences')).toBeInTheDocument()
    expect(pushMock).toHaveBeenCalledWith('?type=full-time', {
      scroll: false,
    })

    fireEvent.click(screen.getByRole('button', { name: /All/ }))

    expect(getExperienceIds()).toHaveLength(experiences.length)
    expect(pushMock).toHaveBeenLastCalledWith('?', { scroll: false })
  })

  it('should start from the type in the url', () => {
    currentParams = new URLSearchParams('type=open-source')
    renderView()

    expect(getExperienceIds()).toEqual([
      'react4noobs',
      'he4rt-team',
      'open-source',
    ])
  })

  it('should ignore an unknown type in the url', () => {
    currentParams = new URLSearchParams('type=nope')
    renderView()

    expect(getExperienceIds()).toHaveLength(experiences.length)
  })

  it('should start with every experience collapsed and its details inert', () => {
    renderView()

    within(getFeed())
      .getAllByRole('button', { expanded: false })
      .forEach(toggle => {
        expect(
          document.getElementById(toggle.getAttribute('aria-controls')!),
        ).toHaveAttribute('inert')
      })
    expect(
      within(getFeed()).queryAllByRole('button', { expanded: true }),
    ).toHaveLength(0)
  })

  it('should open and close one experience without touching the others', () => {
    renderView()

    fireEvent.click(getToggle(/^Petlove/))

    expect(getToggle(/^Petlove/)).toHaveAttribute('aria-expanded', 'true')
    expect(
      document.getElementById('experience-petlove-panel'),
    ).not.toHaveAttribute('inert')
    expect(document.querySelector('#experience-petlove article')).toHaveClass(
      'is-focused',
    )
    expect(getToggle(/^Juntos Somos Mais/)).toHaveAttribute(
      'aria-expanded',
      'false',
    )

    fireEvent.click(getToggle(/^Petlove/))

    expect(getToggle(/^Petlove/)).toHaveAttribute('aria-expanded', 'false')
    expect(
      document.querySelector('#experience-petlove article'),
    ).not.toHaveClass('is-focused')
  })

  it('should expand and collapse every visible experience at once', () => {
    renderView()

    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))

    expect(
      within(getFeed()).getAllByRole('button', { expanded: true }),
    ).toHaveLength(experiences.length)

    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }))

    expect(
      within(getFeed()).queryAllByRole('button', { expanded: true }),
    ).toHaveLength(0)
  })

  it('should open the experience from a highlight, even when filtered out', () => {
    const scrollIntoView = jest.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    currentParams = new URLSearchParams('type=open-source')
    renderView()

    fireEvent.click(
      screen.getByRole('link', { name: /See experience\s?: Petlove/ }),
    )

    expect(getExperienceIds()).toHaveLength(experiences.length)
    expect(getToggle(/^Petlove/)).toHaveAttribute('aria-expanded', 'true')
    expect(window.location.hash).toBe('#experience-petlove')
    expect(scrollIntoView).toHaveBeenCalledTimes(1)
  })

  it('should open the experience named in the url hash', () => {
    window.history.replaceState(null, '', '/#experience-nimbus-black')
    renderView()

    expect(getToggle(/^Nimbus Black/)).toHaveAttribute('aria-expanded', 'true')
  })
})
