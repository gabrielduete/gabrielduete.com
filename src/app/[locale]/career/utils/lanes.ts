import { ExperienceType, IPeriod } from '../types'
import { getPeriodEnd, toMonthIndex } from './period'

export const PX_PER_MONTH = 15
export const COLLAPSED_CARD_PX = 140
export const LANE_GAP_PX = 16

export type LaneItem = {
  experience: string
  topPx: number
  railTopPx: number
  railHeightPx: number
}

export type Lane = {
  type: ExperienceType
  items: LaneItem[]
}

export type TimelineLayout = {
  heightPx: number
  years: { year: number; topPx: number }[]
  lanes: Lane[]
}

type BuildOptions = {
  pxPerMonth?: number
  collapsedCardPx?: number
  gapPx?: number
}

export const buildTimelineLayout = <T extends string>(
  experiences: T[],
  periods: Record<T, IPeriod>,
  types: Record<T, ExperienceType>,
  laneOrder: ExperienceType[],
  currentMonth: string,
  options: BuildOptions = {},
): TimelineLayout | null => {
  if (!experiences.length) {
    return null
  }

  const pxPerMonth = options.pxPerMonth ?? PX_PER_MONTH
  const collapsedCardPx = options.collapsedCardPx ?? COLLAPSED_CARD_PX
  const gapPx = options.gapPx ?? LANE_GAP_PX

  const spans = experiences.map(experience => ({
    experience,
    type: types[experience],
    start: toMonthIndex(periods[experience].start),
    end: toMonthIndex(getPeriodEnd(periods[experience], currentMonth)),
  }))

  const firstMonth = Math.min(...spans.map(span => span.start))
  const lastMonth = Math.max(...spans.map(span => span.end))
  const totalMonths = lastMonth - firstMonth + 1

  const lanes = laneOrder
    .map(type => {
      const items = spans
        .filter(span => span.type === type)
        .sort((a, b) => a.start - b.start)
        .reduce<LaneItem[]>((placed, span) => {
          const railTopPx = (span.start - firstMonth) * pxPerMonth
          const previous = placed[placed.length - 1]
          const minTopPx = previous
            ? previous.topPx + collapsedCardPx + gapPx
            : 0

          placed.push({
            experience: span.experience,
            topPx: Math.max(railTopPx, minTopPx),
            railTopPx,
            railHeightPx: (span.end - span.start + 1) * pxPerMonth,
          })

          return placed
        }, [])

      return { type, items }
    })
    .filter(lane => lane.items.length > 0)

  const lastCardBottom = Math.max(
    ...lanes.flatMap(lane =>
      lane.items.map(item => item.topPx + collapsedCardPx),
    ),
  )

  return {
    heightPx: Math.max(totalMonths * pxPerMonth, lastCardBottom),
    years: Array.from(
      { length: Math.floor(lastMonth / 12) - Math.floor(firstMonth / 12) + 1 },
      (_, index) => {
        const year = Math.floor(firstMonth / 12) + index

        return { year, topPx: (year * 12 - firstMonth) * pxPerMonth }
      },
    ),
    lanes,
  }
}
