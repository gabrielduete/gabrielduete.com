import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import TagFilter from '.'

const toggleTagMock = jest.fn()
const clearTagsMock = jest.fn()
let currentTags: string[] = []

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key}:${JSON.stringify(values)}` : key,
}))

jest.mock('@/contexts/FilterContext', () => ({
  useFilter: () => ({
    selectedTags: currentTags,
    toggleTag: toggleTagMock,
    clearTags: clearTagsMock,
  }),
}))

describe('<TagFilter />', () => {
  beforeEach(() => {
    toggleTagMock.mockClear()
    clearTagsMock.mockClear()
    currentTags = []
  })

  it('renders nothing when there are no tags', () => {
    render(<TagFilter tags={[]} />)

    expect(screen.queryByTestId('tag-filter')).not.toBeInTheDocument()
  })

  it('renders a button per tag', () => {
    render(<TagFilter tags={['git', 'react']} />)

    expect(screen.getByRole('button', { name: '#git' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '#react' })).toBeInTheDocument()
  })

  it('marks the selected tags as pressed', () => {
    currentTags = ['react']

    render(<TagFilter tags={['git', 'react']} />)

    expect(screen.getByRole('button', { name: '#react' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: '#git' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('toggles a tag when it is clicked', () => {
    render(<TagFilter tags={['git']} />)

    fireEvent.click(screen.getByRole('button', { name: '#git' }))

    expect(toggleTagMock).toHaveBeenCalledWith('git')
  })

  it('shows every tag when there are at most ten', () => {
    const tags = Array.from({ length: 10 }, (_, index) => `tag-${index}`)

    render(<TagFilter tags={tags} />)

    expect(screen.getAllByRole('button')).toHaveLength(10)
    expect(screen.queryByText(/showMoreTags/)).not.toBeInTheDocument()
  })

  it('collapses the extra tags behind a toggle', () => {
    const tags = Array.from({ length: 20 }, (_, index) => `tag-${index}`)

    render(<TagFilter tags={tags} />)

    expect(screen.getByRole('button', { name: '#tag-9' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '#tag-10' }),
    ).not.toBeInTheDocument()

    const toggle = screen.getByText('showMoreTags:{"count":10}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)

    expect(screen.getByRole('button', { name: '#tag-19' })).toBeInTheDocument()
    expect(screen.getByText('showLessTags')).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('renders the toggle right after the last visible tag', () => {
    const tags = Array.from({ length: 20 }, (_, index) => `tag-${index}`)

    render(<TagFilter tags={tags} />)

    const labels = screen.getAllByRole('listitem').map(item => item.textContent)

    expect(labels).toHaveLength(11)
    expect(labels.at(-2)).toBe('#tag-9')
    expect(labels.at(-1)).toBe('showMoreTags:{"count":10}')
  })

  it('collapses back when the toggle is clicked again', () => {
    const tags = Array.from({ length: 20 }, (_, index) => `tag-${index}`)

    render(<TagFilter tags={tags} />)

    fireEvent.click(screen.getByText('showMoreTags:{"count":10}'))
    fireEvent.click(screen.getByText('showLessTags'))

    expect(
      screen.queryByRole('button', { name: '#tag-10' }),
    ).not.toBeInTheDocument()
  })

  it('keeps a selected tag visible even when it is collapsed', () => {
    currentTags = ['tag-18']

    const tags = Array.from({ length: 20 }, (_, index) => `tag-${index}`)

    render(<TagFilter tags={tags} />)

    expect(screen.getByRole('button', { name: '#tag-18' })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '#tag-17' }),
    ).not.toBeInTheDocument()
  })

  it('shows the clear button only when a tag is selected', () => {
    const { rerender } = render(<TagFilter tags={['git']} />)

    expect(screen.queryByText('clearTags')).not.toBeInTheDocument()

    currentTags = ['git']
    rerender(<TagFilter tags={['git']} />)

    fireEvent.click(screen.getByText('clearTags'))

    expect(clearTagsMock).toHaveBeenCalled()
  })
})
