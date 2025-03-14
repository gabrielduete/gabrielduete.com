import styled from 'styled-components'

export const Header = styled.header`
  margin-top: var(--spacing-xxxlarge);
  display: flex;
  align-items: center;
  justify-content: space-around;
`

export const ContainerLangs = styled.div`
  display: flex;
  gap: var(--spacing-xsmall);
`

export const Lang = styled.button`
  cursor: pointer;
  border: none;
  background: none;
  font-size: var(--subtitle-small);
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) =>
      theme.mode === 'dark'
        ? 'var(--color-green-neutral)'
        : 'var(--color-green-black)'};
  }
`
