import { ReactNode } from "react"

export type TypeA = {
  name: string
}

export type AuthData = {
  userProviderId?: string
  userId?: string
  userName?: string | null
  username_lowercase?: string | null
  githubId?: string | null
  displayName?: string | null
  userEmail?: string | null
  userPhotoLink?: string | null
}

export type ChildrenProps = {
    children?: ReactNode
    title?: string
}