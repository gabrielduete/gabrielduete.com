import styled from 'styled-components'

export const Items = styled.ul`
  background-color: ${({ theme }) =>
    theme.mode === 'dark' ? 'var(--color-green-black)' : 'var(--color-white)'};
  border: 1px solid var(--color-green-weak-border);
  border-radius: var(--radius);
  width: 1000px;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-medium);
  gap: var(--spacing-xxxxlarge);
  list-style: none;
`

export const Item = styled.li`
  font-size: var(--subtitle-small);
`

export const Link = styled.a<{ isSelect: boolean }>`
  text-decoration: none;
  color: ${({ isSelect }) =>
    isSelect ? 'var(--color-green-neutral)' : 'var(--color-white)'};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) =>
      theme.mode === 'dark'
        ? 'var(--color-green-neutral)'
        : 'var(--color-green-black)'};
  }
`
