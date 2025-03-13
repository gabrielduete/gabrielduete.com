import items from './header.data'
import * as S from './styles'

const Header = () => {
  return (
    <S.Header>
      <S.ContainerLangs>
        <S.Lang>PT</S.Lang>
        <S.Lang>/</S.Lang>
        <S.Lang>EN</S.Lang>
      </S.ContainerLangs>
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
      <p>Toggle</p>
    </S.Header>
  )
}

export default Header
