import styled from 'styled-components'

export const Circle = styled.div<{ isDark: boolean }>`
  width: var(--spacing-large);
  height: var(--spacing-large);
  background-color: ${({ isDark }) =>
    isDark ? 'var(--color-green-neutral)' : 'var(--color-green-border)'};
  border-radius: 50%;
  cursor: pointer;
`
