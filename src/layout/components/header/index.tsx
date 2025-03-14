import Navigator from './components/navigator'
import * as S from './styles'

const Header = () => {
  return (
    <S.Header>
      <S.ContainerLangs>
        <S.Lang>PT</S.Lang>
        <p>/</p>
        <S.Lang>EN</S.Lang>
      </S.ContainerLangs>
      <Navigator />
      <p>Toggle</p>
    </S.Header>
  )
}

export default Header
