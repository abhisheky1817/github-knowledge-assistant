export async function getRepository(owner, repo) {
  if (!owner || !repo) {
    throw new Error('Owner and repo parameters are required');
  }

  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'github-knowledge-assistant',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });

  if (response.status === 404) {
    throw new Error('Repository not found on GitHub');
  }

  if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
    throw new Error('GitHub API rate limit exceeded');
  }

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    githubId: data.id,
    name: data.name,
    fullName: data.full_name,
    owner: data.owner?.login || owner,
    url: data.html_url,
    description: data.description ?? null,
    defaultBranch: data.default_branch,
  };
}
