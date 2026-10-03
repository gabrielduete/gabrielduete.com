import { MouseEvent } from 'react'

import { trackSpotlight } from './spotlight'

describe('trackSpotlight', () => {
  it('should expose the cursor position relative to the element', () => {
    const element = document.createElement('div')
    element.getBoundingClientRect = () => ({ left: 10, top: 20 }) as DOMRect

    trackSpotlight({
      currentTarget: element,
      clientX: 60,
      clientY: 50,
    } as unknown as MouseEvent<HTMLElement>)

    expect(element.style.getPropertyValue('--mouse-x')).toBe('50px')
    expect(element.style.getPropertyValue('--mouse-y')).toBe('30px')
  })
})
