import { atom } from 'jotai'
import { RepoDataFull } from '../types/repos'

export const projectDataAtom = atom<RepoDataFull>({} as RepoDataFull)
export const textEditorAtom = atom<string | undefined>('');