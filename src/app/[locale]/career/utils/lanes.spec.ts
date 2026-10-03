import { ExperienceType, IPeriod } from '../types'
import { COLLAPSED_CARD_PX, PX_PER_MONTH, buildTimelineLayout } from './lanes'

const periods: Record<string, IPeriod> = {
  Petlove: { start: '2026-03', end: null },
  'Juntos Somos Mais': { start: '2021-12', end: '2026-03' },
  'Nimbus Black': { start: '2024-08', end: '2025-03' },
  React4Noobs: { start: '2023-09', end: null },
  'He4rt Team': { start: '2022-06', end: '2023-01' },
}

const types: Record<string, ExperienceType> = {
  Petlove: 'full-time',
  'Juntos Somos Mais': 'full-time',
  'Nimbus Black': 'freelance',
  React4Noobs: 'open-source',
  'He4rt Team': 'open-source',
}

const laneOrder: ExperienceType[] = ['full-time', 'freelance', 'open-source']

const options = { pxPerMonth: 10, collapsedCardPx: 100, gapPx: 10 }

const build = (experiences: string[]) =>
  buildTimelineLayout(
    experiences,
    periods,
    types,
    laneOrder,
    '2026-10',
    options,
  )

describe('buildTimelineLayout', () => {
  it('should fall back to the default scale when no option is given', () => {
    const layout = buildTimelineLayout(
      ['Nimbus Black'],
      periods,
      types,
      laneOrder,
      '2026-10',
    )

    expect(layout?.lanes[0].items[0].railHeightPx).toBe(8 * PX_PER_MONTH)
    expect(layout?.heightPx).toBe(COLLAPSED_CARD_PX)
  })

  it('should return null when there is no experience', () => {
    expect(build([])).toBeNull()
  })

  it('should group the experiences into one lane per type', () => {
    const layout = build(Object.keys(periods))

    expect(layout?.lanes.map(lane => lane.type)).toEqual(laneOrder)
    expect(layout?.lanes[0].items.map(item => item.experience)).toEqual([
      'Juntos Somos Mais',
      'Petlove',
    ])
  })

  it('should drop the lanes that have no experience', () => {
    const layout = build(['Nimbus Black'])

    expect(layout?.lanes).toHaveLength(1)
    expect(layout?.lanes[0].type).toBe('freelance')
  })

  it('should place the rail of each experience at its start date', () => {
    const layout = build(Object.keys(periods))

    const [juntos, petlove] = layout!.lanes[0].items

    expect(juntos.railTopPx).toBe(0)
    expect(petlove.railTopPx).toBe(51 * 10)
  })

  it('should size the rail by the duration of the experience', () => {
    const layout = build(['Nimbus Black'])

    expect(layout?.lanes[0].items[0].railHeightPx).toBe(8 * 10)
  })

  it('should run the rail of an ongoing experience up to the current month', () => {
    const layout = build(['Petlove'])

    expect(layout?.lanes[0].items[0].railHeightPx).toBe(8 * 10)
  })

  it('should anchor the card to the start of its experience', () => {
    const layout = build(Object.keys(periods))

    const [, petlove] = layout!.lanes[0].items

    expect(petlove.topPx).toBe(petlove.railTopPx)
  })

  it('should push a card down when it would overlap the one above in the lane', () => {
    const crowded: Record<string, IPeriod> = {
      first: { start: '2024-01', end: '2024-03' },
      second: { start: '2024-02', end: '2024-06' },
    }
    const crowdedTypes: Record<string, ExperienceType> = {
      first: 'freelance',
      second: 'freelance',
    }

    const layout = buildTimelineLayout(
      ['first', 'second'],
      crowded,
      crowdedTypes,
      laneOrder,
      '2026-10',
      options,
    )

    const [first, second] = layout!.lanes[0].items

    expect(first.topPx).toBe(0)
    expect(second.railTopPx).toBe(10)
    expect(second.topPx).toBe(110)
  })

  it('should expose one tick per year of the range', () => {
    const layout = build(Object.keys(periods))

    expect(layout?.years.map(tick => tick.year)).toEqual([
      2021, 2022, 2023, 2024, 2025, 2026,
    ])
    expect(layout?.years[0].topPx).toBe(-11 * 10)
    expect(layout?.years[1].topPx).toBe(10)
  })

  it('should be tall enough for the whole range and for the last card', () => {
    const layout = build(Object.keys(periods))

    expect(layout?.heightPx).toBe(610)
  })

  it('should fall back to the range when every card fits inside it', () => {
    const layout = build(['Juntos Somos Mais'])

    expect(layout?.heightPx).toBe(52 * 10)
  })

  it('should grow when the stacked cards go past the end of the range', () => {
    const short: Record<string, IPeriod> = {
      a: { start: '2024-01', end: '2024-02' },
      b: { start: '2024-02', end: '2024-03' },
    }
    const shortTypes: Record<string, ExperienceType> = {
      a: 'freelance',
      b: 'freelance',
    }

    const layout = buildTimelineLayout(
      ['a', 'b'],
      short,
      shortTypes,
      laneOrder,
      '2026-10',
      options,
    )

    expect(layout?.heightPx).toBe(210)
  })
})
