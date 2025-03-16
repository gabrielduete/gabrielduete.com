import Navigator from './components/Navigator'
import ToggleLang from './components/ToggleLang'
import ToggleTheme from './components/ToggleTheme'
import * as S from './styles'

const Header = () => {
  return (
    <S.Header>
      <ToggleLang />
      <Navigator />
      <ToggleTheme />
    </S.Header>
  )
}

export default Header
