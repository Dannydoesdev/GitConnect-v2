import { atom } from 'jotai';

// First, let's properly type our quickstart state
interface QuickstartProfile {
  name: string;
  userName: string;
  username_lowercase: string;
  userPhotoLink: string;
  bio?: string;
  userId: string;
  // ... other profile fields
}

interface QuickstartProject {
  id: string;
  name: string;
  description: string;
  hidden: boolean;
  userId: string;
  username_lowercase: string;
  // ... other project fields
}

interface QuickstartState {
  // profile: QuickstartProfile | null;
  // projects: QuickstartProject[];
  profile: any;  // TODO: Type this properly based on profile structure
  projects: any[];  // TODO: Type this properly based on  project structure
  isQuickstart: boolean;
  anonymousId: string | null;
  step?: 'select' | 'preview' | 'complete';
}

// Add new atoms for quickstart flow
// interface QuickstartState {
//   profile: any;  // TODO: Type this properly based on profile structure
//   projects: any[];  // TODO: Type this properly based on  project structure
//   isQuickstart: boolean;
// }


// Create the main atom with proper typing
export const quickstartStateAtom = atom<QuickstartState>({
  profile: null,
  projects: [],
  isQuickstart: false,
  anonymousId: null,
  // step: 'select'
});


// export const quickstartStateAtom = atom<QuickstartState>({
//   profile: null,
//   projects: [],
//   isQuickstart: false
// });

// Add derived atoms for common operations
export const quickstartProjectsAtom = atom(
  (get) => get(quickstartStateAtom).projects
);

export const quickstartDraftProjectsAtom = atom(
  (get) => get(quickstartStateAtom).projects.filter(p => p.hidden)
);

export const quickstartPublishedProjectsAtom = atom(
  (get) => get(quickstartStateAtom).projects.filter(p => !p.hidden)
);




interface ProfileFormData {
  bio?: string;
  location?: string;
  name?: string;
  headline?: string;
  skills?: string[];
  company?: string;
  position?: string;
  techStack?: string[];
  website?: string;
  profileTags?: string[];
  githubUrl?: string;
  gitlabUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  mediumUrl?: string;
  hashnodeUrl?: string;
  codepenUrl?: string;
  dribbbleUrl?: string;
  behanceUrl?: string;
  devToUrl?: string;
  youtubeUrl?: string;
  twitchUrl?: string;
  discordUrl?: string;
  stackoverflowUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  openToWork?: boolean;
  [key: string]: any; // This allows you to add arbitrary fields
}

export const quickstartProfilePanelForm = atom<ProfileFormData>({
  bio: '',
  location: '',
  name: '',
  headline: '',
  skills: [],
  company: '',
  position: '',
  techStack: [],
  website: '',
  profileTags: [],
  githubUrl: '',
  gitlabUrl: '',
  linkedinUrl: '',
  twitterUrl: '',
  mediumUrl: '',
  hashnodeUrl: '',
  codepenUrl: '',
  dribbbleUrl: '',
  behanceUrl: '',
  devToUrl: '',
  youtubeUrl: '',
  twitchUrl: '',
  discordUrl: '',
  stackoverflowUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  openToWork: false,
});