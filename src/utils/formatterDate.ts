export const parseDate = (date: string): Date => {
  const [day, month, year] = date.split('-')

  return new Date(`${year}-${month}-${day}`)
}
