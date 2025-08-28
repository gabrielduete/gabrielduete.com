import TabTitleWatcher from '@/components/TabTitleWatcher/TabTitleWatcher'

import CarrerView from './views/ClientView'

export const metadata = {
  title: 'Gabriel Duete | Carrer',
  description: 'Carrer page of Gabriel Duete, a software developer.',
}

const Career = () => {
  return (
    <>
      <TabTitleWatcher originalTitle={metadata.title} />
      <CarrerView />
    </>
  )
}

export default Career
