import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  gap: var(--spacing-xsmall);
`

export const Lang = styled.button<{ isSelect: boolean }>`
  cursor: pointer;
  border: none;
  background: none;
  font-size: var(--subtitle-small);
  transition: color 0.2s;
  color: ${({ isSelect }) => isSelect && 'var(--color-green-neutral)'};

  &:hover {
    color: ${({ theme }) =>
      theme.mode === 'dark'
        ? 'var(--color-green-neutral)'
        : 'var(--color-green-black)'};
  }
`
