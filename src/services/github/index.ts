const BASE_URL = 'https://api.github.com/users'

export type GithubUser = {
  avatar_url: string
  name: string
  login: string
  bio: string
  public_repos: number
  html_url: string
}

export type GithubRepo = {
  id: number
  name: string
  html_url: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
}

export const getGithubRepos = async (
  username: string,
): Promise<GithubRepo[]> => {
  const res = await fetch(`${BASE_URL}/${username}/repos`)

  if (!res.ok) {
    throw new Error(`Failed to fetch repos: ${res.status}`)
  }

  return res.json()
}
