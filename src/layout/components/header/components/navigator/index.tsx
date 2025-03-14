import { useRouter } from 'next/router'

import items from './navigator.data'
import * as S from './styles'

const Navigator = () => {
  const router = useRouter()

  const isSelect = (path: string) => {
    const query = router.pathname

    return (
      query === `/${path.toLowerCase()}` || (query === '/' && path === 'Hello')
    )
  }

  return (
    <S.Items>
      {items.map(({ name, href }) => {
        return (
          <S.Item key='name'>
            <S.Link href={href} target='_self' isSelect={isSelect(name)}>
              {name}
            </S.Link>
          </S.Item>
        )
      })}
    </S.Items>
  )
}

export default Navigator
