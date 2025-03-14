import items from './navigator.data'
import * as S from './styles'

const Navigator = () => {
  return (
    <S.Items>
      {items.map(({ name, href }) => {
        return (
          <S.Item key='name'>
            <S.Link href={href} target='_self' isSelect={false}>
              {name}
            </S.Link>
          </S.Item>
        )
      })}
    </S.Items>
  )
}

export default Navigator
