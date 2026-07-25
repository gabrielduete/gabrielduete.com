import { hasWindow } from './hasWindow'

describe('hasWindow', () => {
  it('is true in a browser-like environment', () => {
    expect(hasWindow).toBe(true)
  })
})
