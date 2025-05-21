// hooks/quickstart/useQuickstartAuth.ts
import { useState, useCallback } from 'react';
import { auth, db } from '@/firebase/clientApp';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInAnonymously, User as FirebaseUser } from 'firebase/auth';
import type { GithubProfileData } from '../types';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; 

export const useQuickstartAuth = () => {
  const [anonymousUser, setAnonymousUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle retry logic for rate limiting (exponential backoff - edge case)
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const createAnonymousSession = useCallback(async (
    githubProfileToStore?: GithubProfileData,
    retryCount = 0
  ): Promise<FirebaseUser | null> => {
    setError(null);
    setIsLoading(true);

    try {
      // Always sign out any existing user to ensure clean state when creating a new anonymous user
      if (auth.currentUser) {
        await auth.signOut();
      }

      // Create new anonymous user
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      setAnonymousUser(user);

      // Store the UID in localStorage for future reference in migration
      localStorage.setItem('anonymousUid', user.uid);

      // Save GitHub profile data to Firestore - will be stored in authContext
      if (githubProfileToStore) {
        const userDocRef = doc(db, 'usersAnonymous', user.uid);
        await setDoc(
          userDocRef,
          {
            gitconnect_created_at: new Date().toISOString(),
            gitconnect_updated_at: new Date().toISOString(),
            gitconnect_created_at_unix: Date.now(),
            gitconnect_updated_at_unix: Date.now(),
            githubId: githubProfileToStore.githubId,
            userId: user.uid,
            userName: githubProfileToStore.userName,
            username_lowercase: githubProfileToStore.userName?.toLowerCase(),
            isPro: false,
            userPhotoLink: githubProfileToStore.avatar_url,
            displayName: githubProfileToStore.name,
          },
          { merge: true }
        );
      }

      setIsLoading(false);
      return user;

    } catch (err: any) {
      console.error('Error during anonymous authentication:', err);
      
      // Handle rate limiting specifically
      if (err.code === 'auth/too-many-requests' && retryCount < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
        console.log(`Rate limited, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await sleep(delay);
        return createAnonymousSession(githubProfileToStore, retryCount + 1);
      }

      setError(err.message || 'Failed to create quickstart user, please try again.');
      setIsLoading(false);
      setAnonymousUser(null);
      return null;
    }
  }, []);


  return { anonymousUser, isLoading, error, createAnonymousSession };
};