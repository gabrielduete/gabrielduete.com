export const filters = {
  'pt-br': ['Todos', 'Front-end', 'Engenharia', 'Úteis'],
  en: ['All', 'Front-end', 'Engineering', 'Utils'],
} as const

export const filterTranslations: IFilterTranslations = {
  'pt-br': {
    All: 'Todos',
    'Front-end': 'Front-end',
    Engineering: 'Engenharia',
    Utils: 'Úteis',
  },
  en: {
    Todos: 'All',
    'Front-end': 'Front-end',
    Engenharia: 'Engineering',
    Úteis: 'Utils',
  },
}
