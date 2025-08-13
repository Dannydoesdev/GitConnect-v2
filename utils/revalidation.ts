import { getAuth } from 'firebase/auth';

export async function triggerHomepageRevalidation() {
  if (typeof window === 'undefined') return false;
  // Simpler client-side revalidation, not as secure as server-side (removed for OSS)
  // const res = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATION_TOKEN}`);
  try {
    // Revalidate home page server-side with logged in auth token
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
    const idToken = await currentUser.getIdToken();
    const res = await fetch('/api/revalidate-home', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    });
    return res.ok;
  } catch (error) {
    return false;
  }
}