import Router from 'next/router';
import { WritableAtom, atom } from 'jotai';
import { atomWithHash } from 'jotai-location';
import { RepoDataFull } from '../types/repos';

export const projectDataAtom = atom<RepoDataFull>({} as RepoDataFull);
export const textEditorAtom = atom<string | undefined>('');
export const aiEditorAtom = atom<string | undefined>('');
export const aiImageAtom = atom<string | undefined>('');

export const unsavedChangesAtom = atom<boolean>(false);
export const unsavedChangesSettingsAtom = atom<boolean>(false);
export const isProAtom = atom<boolean>(false);

const pageAtom = atomWithHash('page', 1, {
  // replaceState: true,
  setHash: 'replaceState',
  subscribe: (callback) => {
    Router.events.on('routeChangeComplete', callback);
    window.addEventListener('hashchange', callback);
    return () => {
      Router.events.off('routeChangeComplete', callback);
      window.removeEventListener('hashchange', callback);
    };
  },
});


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

export const formDataAtom = atom<ProfileFormData>({
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