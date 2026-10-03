import { IPeriod } from '../types'

type Translate = (
  key: string,
  values?: Record<string, string | number | Date>,
) => string

export const toMonthIndex = (value: string): number => {
  const [year, month] = value.split('-').map(Number)

  return year * 12 + (month - 1)
}

export const fromMonthIndex = (index: number): string => {
  const year = Math.floor(index / 12)
  const month = (index % 12) + 1

  return `${year}-${String(month).padStart(2, '0')}`
}

export const getCurrentMonth = (now: Date = new Date()): string =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

export const getPeriodEnd = (period: IPeriod, currentMonth: string): string =>
  period.end ?? currentMonth

export const getDurationInMonths = (
  period: IPeriod,
  currentMonth: string,
): number =>
  toMonthIndex(getPeriodEnd(period, currentMonth)) -
  toMonthIndex(period.start) +
  1

export const formatMonthYear = (value: string, t: Translate): string => {
  const [year, month] = value.split('-')

  return t('monthYear', {
    month: t(`months.${Number(month)}`),
    year,
  })
}

export const formatDuration = (months: number, t: Translate): string => {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12

  if (!years) {
    return t('monthsCount', { count: remainingMonths })
  }

  const yearsLabel = t('yearsCount', { count: years })

  if (!remainingMonths) {
    return yearsLabel
  }

  return t('durationJoin', {
    years: yearsLabel,
    months: t('monthsCount', { count: remainingMonths }),
  })
}

export const formatPeriod = (
  period: IPeriod,
  t: Translate,
  currentMonth: string,
): string => {
  const start = formatMonthYear(period.start, t)
  const end = period.end ? formatMonthYear(period.end, t) : t('present')
  const range = `${start} - ${end}`

  if (!period.end) {
    return range
  }

  return `${range} · ${formatDuration(getDurationInMonths(period, currentMonth), t)}`
}

const compareByPeriod = (
  a: IPeriod,
  b: IPeriod,
  currentMonth: string,
): number => {
  if (!a.end !== !b.end) {
    return a.end ? 1 : -1
  }

  const byEnd =
    toMonthIndex(getPeriodEnd(b, currentMonth)) -
    toMonthIndex(getPeriodEnd(a, currentMonth))

  if (byEnd !== 0) {
    return byEnd
  }

  return toMonthIndex(b.start) - toMonthIndex(a.start)
}

export const sortByPeriod = <T extends { period: IPeriod | null }>(
  items: T[],
  currentMonth: string,
): T[] =>
  [...items].sort((a, b) => {
    if (!a.period || !b.period) {
      return Number(!a.period) - Number(!b.period)
    }

    return compareByPeriod(a.period, b.period, currentMonth)
  })
