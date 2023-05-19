
// Conversion function for taking data from the database and converting it to the format used in the app
export function convertToRepoData(fullData: RepoDataFull): RepoData {
  return {
    id: fullData.id,
    name: fullData.name,
    fork: fullData.fork,
    url: fullData.html_url,
    description: fullData.description,
    license: fullData.license,
  };
}

// Interface for data used in the app
export interface RepoData {
  id: number;
  name: string;
  fork: boolean;
  url: string;
  description?: string | null;
  license?: { name?: string } | null;
}



// Interface for data in the database
export interface RepoDataFull {
  allow_forking?: boolean;
  allow_merge_commit?: boolean | null;
  allow_rebase_merge?: boolean | null;
  allow_squash_merge?: boolean | null;
  archive_url?: string;
  archived?: boolean;
  assignees_url?: string;
  blobs_url?: string;
  branches_url?: string;
  clone_url?: string;
  collaborators_url?: string;
  forks?: number;
  forks_count?: number;
  id: number;
  name: string;
  fork: boolean;
  url: string;
  description?: string| null;
  license?: {
    name?: string;
    node_id?: string;
    spdx_id?: string;
    url?: string;
    key?: string;
  } | null;
  contributors_url?: string;
  comments_url?: string;
  commits_url?: string;
  created_at?: string | null;
  default_branch?: string;
  deployments_url?: string;
  disabled?: boolean;
  downloads_url?: string;
  events_url?: string;
  forks_url?: string;
  full_name?: string;
  git_commits_url?: string;
  git_refs_url?: string;
  git_tags_url?: string;
  git_url?: string;
  has_discussions?: boolean;
  has_downloads?: boolean;
  has_issues?: boolean;
  has_pages?: boolean;
  has_projects?: boolean;
  has_wiki?: boolean;
  homepage?: string | null;
  html_url: string;
  issue_comment_url?: string;
  issue_events_url?: string;
  issues_url?: string;
  keys_url?: string;
  labels_url?: string;
  language?: string  | null;
  languages_url?: string | null;
  license_url?: string | null;
  merges_url?: string | null;
  milestones_url?: string | null;
  mirror_url?: string | null;
  network_count?: number | null;
  node_id?: string | null;
  notifications_url?: string | null;
  open_issues?: number | null;
  open_issues_count?: number | null;
  owner_url?: string | null;
  private?: boolean | null;
  pulls_url?: string;
  pushed_at?: string | null;
  releases_ur?: string;
  size?: number;
  ssh_url?: string;
  stargazers_count?: number;
  stargazers_url?: string | null;
  statuses_url?: string;
  subscribers_count?: number;
  subscribers_url?: string | null;
  subscription_url?: string | null; 
  svn_url?: string | null;
  tags_url?: string | null;
  teams_url?: string | null;
  temp_clone_token?: string | null;
  trees_url?: string | null;
  topics?: string[] | null;
  updated_at?: string | null;
  visibility?: string;
  watchers?: number;
  watchers_count?: number;
  web_commit_signoff_required?: boolean;
  owner: {
    avatar_url?: string;
    id: number;
    login: string;
    url?: string;
    html_url?: string;
    type?: string;
    site_admin?: boolean;
    node_id?: string;
    gravatar_id?: string | null;
    followers_url?: string;
    following_url?: string;
    gists_url?: string;
    organizations_url?: string;
    received_events_url?: string;
    starred_url?: string;
    subscriptions_url?: string;
    repos_url?: string;
    events_url?: string;
  } | null;
} 


