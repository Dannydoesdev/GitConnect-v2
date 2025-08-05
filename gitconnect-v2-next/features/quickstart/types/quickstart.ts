
export interface RepoOwner {
  login: string;
  avatar_url: string;
}

export interface RepoLicense {
  name: string;
}

export interface QuickstartProfileTrimmed {
  userName: string;
  githubId: number;
  avatar_url?: string;
  html_url: string;
  name?: string;
  company?: string;
  location?: string;
  email?: string;
  bio?: string;
} 

export interface QuickstartRepoTrimmed {
  id: number;
  repoId?: number;
  name: string;
  description: string;
  tags?: string[];
  license?: RepoLicense | string | null;
  fork_count?: number;
  fork?: boolean;
  star_count?: number;
  open_issues_count?: number;
  main_language?: string | null;
  url: string;
  html_url: string;
  languages_url?: string;
}

export type QuickstartObject = {
  name: string;
  description: string;
  tags: string[];
  readme: string;
};

export type QuickstartProject = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  readme: string;
};


export type QuickstartProfile = {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
  html_url: string;
  bio: string;  
  location: string;
  headline: string;
  skills: string[];
  company: string;
  position: string;
  techStack: string[];
  website: string;
  profileTags: string[];
  githubUrl: string;
  gitlabUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  mediumUrl: string;
  hashnodeUrl: string;
  codepenUrl: string;
  dribbbleUrl: string;
  behanceUrl: string;
  devToUrl: string;
  youtubeUrl: string;
  twitchUrl: string;
  discordUrl: string;
  stackoverflowUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  openToWork: boolean;
  [key: string]: any; 
}| null;



export interface QuickstartRepoUploadData {
  id: number;
  repoId?: number;
  name: string;
  description: string;
  tags?: string[];
  license?: string | null;
  fork_count?: number;
  fork?: boolean;
  star_count?: number;
  open_issues_count?: number;
  main_language?: string | null;
  url?: string;
  html_url?: string;
  languages_url?: string;
  languagePercententages?: string[] | null;
  readme?: string | null;
  username?: string;
  htmlOutput?: string | null;
  language_breakdown_percent?: string[] | null;
  hidden: boolean;
  userId: string;
  username_lowercase?: string;
  gitconnect_created_at: string;
  gitconnect_updated_at: string;
  gitconnect_created_at_unix: number;
  gitconnect_updated_at_unix: number;
  reponame_lowercase?: string;
}

export interface QuickstartRepoData {
  name: string;
  owner?: RepoOwner;
  username?: string;
  id: number;
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
  hidden?: boolean;
}
