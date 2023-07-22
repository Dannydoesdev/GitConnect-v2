import { atom } from 'jotai'
// import { atomWithHash } from 'jotai-location'
import { RepoDataFull } from '../types/repos'

export const projectDataAtom = atom<RepoDataFull>({} as RepoDataFull)
export const textEditorAtom = atom<string | undefined>('');

const pageAtom = atomWithHash('page', 1, {
  replaceState: true,
  subscribe: (callback) => {
    Router.events.on('routeChangeComplete', callback)
    window.addEventListener('hashchange', callback)
    return () => {
      Router.events.off('routeChangeComplete', callback)
      window.removeEventListener('hashchange', callback)
    }
  },
})