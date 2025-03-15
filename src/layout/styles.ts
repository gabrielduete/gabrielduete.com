import styled from 'styled-components'

export const Header = styled.header`
  background-color: ${({ theme }) =>
    theme.mode === 'dark' ? 'var(--color-green-border)' : 'var(--color-white)'};
`
