
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


export interface RepoDataFullWithTags {
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
  techStack?: [],
  projectCategories?: [],
  projectTags?: [],
  coverImage?: string,
  coverImageMeta?: {
    sizes: [],
    name: string,
    extension: string,
  },
  liveUrl?: string,
  views?: number,
  userName?: string,
  userId?: string,
  username_lowercase?: string,
  reponame_lowercase?: string,
  gitconnect_created_at?: string,
  gitconnect_updated_at?: string,
  gitconnect_created_at_unix?: number,
  gitconnect_updated_at_unix?: number,
  openToCollaboration?: boolean,
  hidden?: boolean,
  visibleToPublic?: boolean,
  is_template?: boolean,
  stars?: string[],
  repo_url?: string,
  repoUrl?: string,
  live_url?: string,
} 

// {
//   "comments_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/comments{/number}",
//   "has_pages": false,
//   "visibleToPublic": true,
//   "stargazers_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/stargazers",
//   "gitconnect_created_at": "2023-09-15T06:16:30.764Z",
//   "has_wiki": true,
//   "web_commit_signoff_required": false,
//   "has_issues": true,
//   "pulls_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/pulls{/number}",
//   "projectDescription": "Youtube AI Summariser Toolkit",
//   "projectTitle": "Summarise and Shine",
//   "ssh_url": "git@github.com:Dannydoesdev/summarise-and-shine.git",
//   "mirror_url": null,
//   "collaborators_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/collaborators{/collaborator}",
//   "owner": {
//       "id": 50442868,
//       "gravatar_id": "",
//       "received_events_url": "https://api.github.com/users/Dannydoesdev/received_events",
//       "events_url": "https://api.github.com/users/Dannydoesdev/events{/privacy}",
//       "subscriptions_url": "https://api.github.com/users/Dannydoesdev/subscriptions",
//       "gists_url": "https://api.github.com/users/Dannydoesdev/gists{/gist_id}",
//       "type": "User",
//       "site_admin": false,
//       "repos_url": "https://api.github.com/users/Dannydoesdev/repos",
//       "login": "Dannydoesdev",
//       "html_url": "https://github.com/Dannydoesdev",
//       "starred_url": "https://api.github.com/users/Dannydoesdev/starred{/owner}{/repo}",
//       "avatar_url": "https://avatars.githubusercontent.com/u/50442868?v=4",
//       "node_id": "MDQ6VXNlcjUwNDQyODY4",
//       "following_url": "https://api.github.com/users/Dannydoesdev/following{/other_user}",
//       "followers_url": "https://api.github.com/users/Dannydoesdev/followers",
//       "url": "https://api.github.com/users/Dannydoesdev",
//       "organizations_url": "https://api.github.com/users/Dannydoesdev/orgs"
//   },
//   "assignees_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/assignees{/user}",
//   "forks": 0,
//   "archived": false,
//   "gitconnect_updated_at_unix": 1694758590764,
//   "subscription_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/subscription",
//   "fork": false,
//   "contents_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/contents/{+path}",
//   "default_branch": "main",
//   "archive_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/{archive_format}{/ref}",
//   "private": false,
//   "size": 2099,
//   "issue_events_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/issues/events{/number}",
//   "coverImage": "https://firebasestorage.googleapis.com/v0/b/gitconnect-86655.appspot.com/o/users%2FbO4o8u9IskNbFk2wXZmjtJhAYkR2%2Frepos%2F640553465%2Fimages%2FcoverImage%2Fcute%20robot%20typing%20in%20computer%20realistc.jpg?alt=media&token=1004e1bf-a3c3-448d-ba4c-881a59667b59",
//   "issues_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/issues{/number}",
//   "views": 23,
//   "projectCategories": [
//       "backend",
//       "ai",
//       "productivity"
//   ],
//   "disabled": false,
//   "git_url": "git://github.com/Dannydoesdev/summarise-and-shine.git",
//   "is_template": false,
//   "clone_url": "https://github.com/Dannydoesdev/summarise-and-shine.git",
//   "description": "YT summarisation toolkit",
//   "keys_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/keys{/key_id}",
//   "statuses_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/statuses/{sha}",
//   "commits_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/commits{/sha}",
//   "id": 640553465,
//   "forks_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/forks",
//   "gitconnect_updated_at": "2023-09-15T06:16:30.764Z",
//   "topics": [],
//   "userName": "Dannydoesdev",
//   "labels_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/labels{/name}",
//   "contributors_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/contributors",
//   "git_commits_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/git/commits{/sha}",
//   "username_lowercase": "dannydoesdev",
//   "reponame_lowercase": "summarise-and-shine",
//   "gitconnect_created_at_unix": 1694758590764,
//   "blobs_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/git/blobs{/sha}",
//   "openToCollaboration": true,
//   "name": "summarise-and-shine",
//   "html_url": "https://github.com/Dannydoesdev/summarise-and-shine",
//   "license": {
//       "node_id": "MDc6TGljZW5zZTEz",
//       "url": "https://api.github.com/licenses/mit",
//       "key": "mit",
//       "spdx_id": "MIT",
//       "name": "MIT License"
//   },
//   "language": "Jupyter Notebook",
//   "has_discussions": false,
//   "open_issues_count": 0,
//   "trees_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/git/trees{/sha}",
//   "deployments_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/deployments",
//   "repoUrl": "https://github.com/Dannydoesdev/summarise-and-shine",
//   "milestones_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/milestones{/number}",
//   "has_projects": true,
//   "allow_forking": true,
//   "techStack": [
//       "python"
//   ],
//   "hooks_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/hooks",
//   "visibility": "public",
//   "updated_at": "2023-05-14T13:31:35Z",
//   "has_downloads": true,
//   "git_refs_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/git/refs{/sha}",
//   "url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine",
//   "open_issues": 0,
//   "teams_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/teams",
//   "homepage": null,
//   "hidden": false,
//   "watchers_count": 0,
//   "forks_count": 0,
//   "notifications_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/notifications{?since,all,participating}",
//   "projectTags": [],
//   "languages_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/languages",
//   "subscribers_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/subscribers",
//   "tags_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/tags",
//   "full_name": "Dannydoesdev/summarise-and-shine",
//   "releases_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/releases{/id}",
//   "stargazers_count": 0,
//   "pushed_at": "2023-05-14T14:40:02Z",
//   "compare_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/compare/{base}...{head}",
//   "git_tags_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/git/tags{/sha}",
//   "stars": [
//       "bO4o8u9IskNbFk2wXZmjtJhAYkR2"
//   ],
//   "merges_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/merges",
//   "created_at": "2023-05-14T13:31:01Z",
//   "issue_comment_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/issues/comments{/number}",
//   "userId": "bO4o8u9IskNbFk2wXZmjtJhAYkR2",
//   "liveUrl": "",
//   "coverImageMeta": {
//       "sizes": [
//           "200x200",
//           "400x400",
//           "768x768",
//           "1024x1024",
//           "2000x2000"
//       ],
//       "name": "cute robot typing in computer realistc.jpg",
//       "extension": "jpg"
//   },
//   "node_id": "R_kgDOJi4R-Q",
//   "downloads_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/downloads",
//   "events_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/events",
//   "watchers": 0,
//   "branches_url": "https://api.github.com/repos/Dannydoesdev/summarise-and-shine/branches{/branch}",
//   "svn_url": "https://github.com/Dannydoesdev/summarise-and-shine"
// }