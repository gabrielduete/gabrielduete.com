import { IPeriod } from '../types'
import {
  formatDuration,
  formatMonthYear,
  formatPeriod,
  fromMonthIndex,
  getCurrentMonth,
  getDurationInMonths,
  getPeriodEnd,
  sortExperiencesByPeriod,
  toMonthIndex,
} from './period'

const dictionary: Record<string, string> = {
  monthYear: '{month} de {year}',
  present: 'o momento',
  durationJoin: '{years} e {months}',
  'months.1': 'Jan',
  'months.3': 'Mar',
  'months.6': 'Jun',
  'months.8': 'Ago',
  'months.9': 'Set',
  'months.12': 'Dez',
}

const t = (key: string, values?: Record<string, unknown>) => {
  if (key === 'yearsCount') {
    return `${values?.count} ${values?.count === 1 ? 'ano' : 'anos'}`
  }

  if (key === 'monthsCount') {
    return `${values?.count} ${values?.count === 1 ? 'mês' : 'meses'}`
  }

  return Object.entries(values ?? {}).reduce(
    (text, [token, value]) => text.replace(`{${token}}`, String(value)),
    dictionary[key] ?? key,
  )
}

describe('toMonthIndex', () => {
  it('should turn a month into a comparable index', () => {
    expect(toMonthIndex('2021-12') + 1).toBe(toMonthIndex('2022-01'))
  })
})

describe('fromMonthIndex', () => {
  it('should be the inverse of toMonthIndex', () => {
    expect(fromMonthIndex(toMonthIndex('2024-08'))).toBe('2024-08')
    expect(fromMonthIndex(toMonthIndex('2023-01'))).toBe('2023-01')
  })
})

describe('getCurrentMonth', () => {
  it('should pad the month of the given date', () => {
    expect(getCurrentMonth(new Date(2026, 2, 15))).toBe('2026-03')
    expect(getCurrentMonth(new Date(2026, 10, 1))).toBe('2026-11')
  })
})

describe('getPeriodEnd', () => {
  it('should fall back to the current month for an ongoing period', () => {
    expect(getPeriodEnd({ start: '2026-03', end: null }, '2026-10')).toBe(
      '2026-10',
    )
  })

  it('should keep the end of a finished period', () => {
    expect(getPeriodEnd({ start: '2024-08', end: '2025-03' }, '2026-10')).toBe(
      '2025-03',
    )
  })
})

describe('getDurationInMonths', () => {
  it('should count both the first and the last month', () => {
    expect(
      getDurationInMonths({ start: '2024-08', end: '2025-03' }, '2026-10'),
    ).toBe(8)
    expect(
      getDurationInMonths({ start: '2021-12', end: '2026-03' }, '2026-10'),
    ).toBe(52)
  })

  it('should count up to the current month when ongoing', () => {
    expect(
      getDurationInMonths({ start: '2026-03', end: null }, '2026-10'),
    ).toBe(8)
  })
})

describe('formatMonthYear', () => {
  it('should apply the localized month and pattern', () => {
    expect(formatMonthYear('2021-12', t)).toBe('Dez de 2021')
  })
})

describe('formatDuration', () => {
  it('should render only the months below a year', () => {
    expect(formatDuration(8, t)).toBe('8 meses')
    expect(formatDuration(1, t)).toBe('1 mês')
  })

  it('should render only the years for a round duration', () => {
    expect(formatDuration(24, t)).toBe('2 anos')
    expect(formatDuration(12, t)).toBe('1 ano')
  })

  it('should join years and months', () => {
    expect(formatDuration(52, t)).toBe('4 anos e 4 meses')
  })
})

describe('formatPeriod', () => {
  it('should omit the duration for an ongoing period', () => {
    expect(formatPeriod({ start: '2026-03', end: null }, t, '2026-10')).toBe(
      'Mar de 2026 - o momento',
    )
  })

  it('should append the duration for a finished period', () => {
    expect(
      formatPeriod({ start: '2021-12', end: '2026-03' }, t, '2026-10'),
    ).toBe('Dez de 2021 - Mar de 2026 · 4 anos e 4 meses')
  })
})

describe('sortExperiencesByPeriod', () => {
  const periods: Record<string, IPeriod> = {
    Petlove: { start: '2026-03', end: null },
    'Juntos Somos Mais': { start: '2021-12', end: '2026-03' },
    'Nimbus Black': { start: '2024-08', end: '2025-03' },
    React4Noobs: { start: '2023-09', end: null },
    'He4rt Team': { start: '2022-06', end: '2023-01' },
  }

  it('should put the ongoing experiences first, then order by end date', () => {
    expect(
      sortExperiencesByPeriod(Object.keys(periods), periods, '2026-10'),
    ).toEqual([
      'Petlove',
      'React4Noobs',
      'Juntos Somos Mais',
      'Nimbus Black',
      'He4rt Team',
    ])
  })

  it('should break a tie on the end date by the most recent start', () => {
    const tied: Record<string, IPeriod> = {
      older: { start: '2020-01', end: '2024-01' },
      newer: { start: '2023-01', end: '2024-01' },
    }

    expect(
      sortExperiencesByPeriod(['older', 'newer'], tied, '2026-10'),
    ).toEqual(['newer', 'older'])
  })

  it('should not mutate the given list', () => {
    const list = ['He4rt Team', 'Petlove']
    sortExperiencesByPeriod(list, periods, '2026-10')

    expect(list).toEqual(['He4rt Team', 'Petlove'])
  })
})
