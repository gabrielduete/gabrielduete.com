import { useTranslations } from 'next-intl'

const Career = () => {
  const t = useTranslations('CarrerPage')

  const contributionKeys = [
    'contrib1',
    'contrib2',
    'contrib3',
    'contrib4',
    'contrib5',
    'contrib6',
  ] as const

  console.debug(t('CarrerPage'))

  return (
    <div>
      <h1>{t('JSM.title')}</h1>
      <ul>
        {contributionKeys.map(key => (
          <li key={key}>{t(`JSM.contributions.${key}`)}</li>
        ))}
      </ul>
    </div>
  )
}

export default Career
