export interface QuickstartAnonymosuUserData {
  gitconnect_created_at: string;
  gitconnect_updated_at: string;
  gitconnect_created_at_unix: number;
  gitconnect_updated_at_unix: number;
  githubId: string;
  userId: string; // Firebase UID
  userName: string;
  username_lowercase?: string;
  isPro: boolean;
  userPhotoLink?: string;
  displayName?: string;
}