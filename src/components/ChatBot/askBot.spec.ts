import { ASK_BOT_EVENT, askBot } from './askBot'

describe('askBot', () => {
  it('dispatches the ask-bot event carrying the snippet text', () => {
    const received: string[] = []
    const handler = (event: Event) => {
      received.push((event as CustomEvent<string>).detail)
    }
    window.addEventListener(ASK_BOT_EVENT, handler)

    askBot('selected passage')

    window.removeEventListener(ASK_BOT_EVENT, handler)
    expect(received).toEqual(['selected passage'])
  })
})
