'use client'

import { Locales } from '@/enums/Locales'
import Giscus from '@giscus/react'

export const GiscusComments = ({
  locale,
  term,
}: {
  locale: string
  term: string
}) => {
  return (
    <div className='mt-xxlarge'>
      <Giscus
        repo='gabrielduete/gabrielduete.com'
        repoId='R_kgDON7zbqA'
        data-repo-id='R_kgDON7zbqA'
        category='General'
        categoryId='DIC_kwDON7zbqM4CsffK'
        mapping='pathname'
        term={term}
        reactionsEnabled='1'
        emitMetadata='0'
        inputPosition='bottom'
        theme='dark_dimmed'
        lang={locale === Locales.EN ? 'en' : 'pt'}
      />
    </div>
  )
}
