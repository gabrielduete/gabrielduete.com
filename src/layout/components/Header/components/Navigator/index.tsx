import Link from 'next/link'
import { useRouter } from 'next/router'

import items from './navigator.data'
import * as S from './styles'

const Navigator = () => {
  const { pathname } = useRouter()

  const isSelect = (path: string) => {
    return (
      pathname === `/${path.toLowerCase()}` ||
      (pathname === '/' && path === 'Hello')
    )
  }

  return (
    <S.Items>
      {items.map(({ name, href }) => {
        return (
          <S.Item key={name}>
            <Link href={href} passHref legacyBehavior>
              <S.Link isSelect={isSelect(name)}>{name}</S.Link>
            </Link>
          </S.Item>
        )
      })}
    </S.Items>
  )
}

export default Navigator
