export const removeLangPath = (pathname: string) => {
  return pathname.replace(/^\/(en|pt-br)?/, '')
}
