import TabTitleWatcher from '@/components/TabTitleWatcher/TabTitleWatcher'

import LabView from './views/Lab'

export const metadata = {
  title: 'Gabriel Duete | Lab',
  description: 'Lab page of Gabriel Duete, a software developer.',
}

const Lab = () => {
  return (
    <>
      <TabTitleWatcher originalTitle={metadata.title} />
      <LabView />
    </>
  )
}

export default Lab
