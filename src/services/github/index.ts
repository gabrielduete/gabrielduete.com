const BASE_URL = 'https://api.github.com/users'

export type GithubRepo = {
  id: number
  name: string
  html_url: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
}

export const getGithubRepos = async (): Promise<GithubRepo[]> => {
  const res = await fetch(`${BASE_URL}/gabrielduete/gists`)

  if (!res.ok) {
    throw new Error(`Failed to fetch repos: ${res.status}`)
  }

  return res.json()
}
