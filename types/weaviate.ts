export type WeaviateObject = {
  name: string;
  description: string;
  tags: string[];
  readme: string;
};

// Define interfaces for the repository data and language breakdown
export interface RepoOwner {
  login: string;
  avatar_url: string;
}

export interface RepoLicense {
  name: string;
}

export interface WeaviateRepoData {
  name: string;
  owner?: RepoOwner;
  username?: string;
  id?: number;
  description: string | null;
  topics?: string[];
  tags?: string[];
  repoid?: number;
  readme?: string;
  html_url?: string;
  license?: RepoLicense | string | null;
  forks_count?: number;
  stargazers_count?: number;
  watchers_count?: number;
  open_issues_count?: number;
  language?: string | null;
  mainLanguage?: string | null;
  languages_url?: string;
  languagePercententages?: string[] | null;
}