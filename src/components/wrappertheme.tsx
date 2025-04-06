const ThemeWithStyled = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
}

export default ThemeWithStyled
