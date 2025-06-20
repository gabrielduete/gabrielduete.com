import { SocialMediaItems } from '@/constants/SocialMediaItems'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { getTranslations } from 'next-intl/server'

import Home from './page'

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
}))

jest.mock('next/image', () => props => <img {...props} />)

jest.mock('@/constants/SocialMediaItems', () => ({
  SocialMediaItems: [
    {
      Icon: () => <svg data-testid='mock-icon' />,
      name: 'Mock Social Media',
      link: 'https://mock-social-media.com',
    },
  ],
}))

describe('<Home />', () => {
  beforeEach(() => {
    ;(getTranslations as jest.Mock).mockResolvedValue(
      (key: string) =>
        ({
          about: 'Mock about text',
        })[key],
    )
  })

  it('should render the profile picture', async () => {
    render(await Home())

    const profilePic = screen.getByAltText('Profile Pic')

    expect(profilePic).toBeInTheDocument()
  })

  it('should render the translated about text', async () => {
    render(await Home())

    const aboutText = await screen.findByText('Mock about text')

    expect(aboutText).toBeInTheDocument()
  })

  it('should render all media links', async () => {
    render(await Home())

    const mediaLinks = screen.getAllByRole('link')

    expect(mediaLinks).toHaveLength(SocialMediaItems.length + 1)
  })

  it('should render the "Juntos Somos Mais" link correctly', async () => {
    render(await Home())

    const juntosLink = screen.getByText('Juntos Somos Mais')

    expect(juntosLink).toBeInTheDocument()
    expect(juntosLink.closest('a')).toHaveAttribute(
      'href',
      'https://g.co/kgs/eVwdD6s',
    )
  })

  it('should render social media icons', async () => {
    render(await Home())

    const icons = screen.getAllByTestId('mock-icon')

    expect(icons).toHaveLength(SocialMediaItems.length)
  })

  it('ensures links open in a new tab with proper attributes', async () => {
    render(await Home())

    const links = screen.getAllByRole('link')

    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })
})
