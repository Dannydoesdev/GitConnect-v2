const REVALIDATION_COOLDOWN = 60000; // 1 minute cooldown

export async function triggerRevalidationWithCooldown() {
  if (typeof window === 'undefined') return false;

  try {
    const lastRevalidation = window.localStorage.getItem('lastRevalidationTime');
    const now = Date.now();

    if (!lastRevalidation || (now - parseInt(lastRevalidation)) > REVALIDATION_COOLDOWN) {
      const res = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATION_TOKEN}`);
      
      if (res.ok) {
        window.localStorage.setItem('lastRevalidationTime', now.toString());
        return true;
      }
    }
    return false;
  } catch (error) {
    console.warn('Failed to trigger revalidation:', error);
    return false;
  }
} 