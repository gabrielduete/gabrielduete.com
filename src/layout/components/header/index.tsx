import Navigator from './components/navigator'
import ToggleLang from './components/toggleLang'
import * as S from './styles'

const Header = () => {
  return (
    <S.Header>
      <ToggleLang />
      <Navigator />
      <p>tema</p>
    </S.Header>
  )
}

export default Header
