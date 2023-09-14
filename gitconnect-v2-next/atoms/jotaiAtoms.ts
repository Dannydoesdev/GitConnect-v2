import { atom } from 'jotai'
import { atomWithHash } from 'jotai-location'
import { RepoDataFull } from '../types/repos'
import Router from 'next/router'

export const projectDataAtom = atom<RepoDataFull>({} as RepoDataFull)
export const textEditorAtom = atom<string | undefined>('');
export const unsavedChangesAtom = atom<boolean>(false);

const pageAtom = atomWithHash('page', 1, {
  // replaceState: true,
  setHash: 'replaceState',
  subscribe: (callback) => {
    Router.events.on('routeChangeComplete', callback)
    window.addEventListener('hashchange', callback)
    return () => {
      Router.events.off('routeChangeComplete', callback)
      window.removeEventListener('hashchange', callback)
    }
  },
})