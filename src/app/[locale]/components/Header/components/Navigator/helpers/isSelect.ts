export const isSelect = (pathname: string, path: string) => {
  return (
    pathname === `/${path.toLowerCase()}` ||
    (pathname === '' && path === 'Hello')
  )
}
