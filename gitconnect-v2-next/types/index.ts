export type { TypeA } from './package-1'

export type { AuthData } from './package-1'
export type { ChildrenProps } from './package-1'

// Notes on using children props in TS
// React Children (deprecated) - Use `typeof React.Children` instead.
// 'Children' refers to a value, but is being used as a type here. Did you mean 'typeof Children