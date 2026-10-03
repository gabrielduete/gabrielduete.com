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

const getCompanies = () =>
  within(getFeed())
    .getAllByRole('heading', { level: 3 })
    .map(heading => heading.textContent)

describe('<ClientView />', () => {
  beforeEach(() => {
    pushMock.mockClear()
    currentParams = new URLSearchParams()
  })

  it('should group the experiences by type, each ordered by period', () => {
    renderView()

    expect(getCompanies()).toEqual([
      'Petlove',
      'Juntos Somos Mais',
      'Nimbus Black',
      'React4Noobs',
      'He4rt Team',
      'Open Source & Community',
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
        name: 'Open Source & Comunidade',
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

    expect(getCompanies()).toEqual(['Petlove', 'Juntos Somos Mais'])
    expect(screen.getByRole('button', { name: /Full-time/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByText('2 experiences')).toBeInTheDocument()
    expect(pushMock).toHaveBeenCalledWith('?type=full-time', {
      scroll: false,
    })

    fireEvent.click(screen.getByRole('button', { name: /All/ }))

    expect(getCompanies()).toHaveLength(experiences.length)
    expect(pushMock).toHaveBeenLastCalledWith('?', { scroll: false })
  })

  it('should start from the type in the url', () => {
    currentParams = new URLSearchParams('type=open-source')
    renderView()

    expect(getCompanies()).toEqual([
      'React4Noobs',
      'He4rt Team',
      'Open Source & Community',
    ])
  })

  it('should ignore an unknown type in the url', () => {
    currentParams = new URLSearchParams('type=nope')
    renderView()

    expect(getCompanies()).toHaveLength(experiences.length)
  })
})
