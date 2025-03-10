export async function triggerHomepageRevalidation() {
  if (typeof window === 'undefined') return false;

  try {
    const res = await fetch(`/api/revalidate?secret=${process.env.NEXT_PUBLIC_REVALIDATION_TOKEN}`);
    return res.ok;
  } catch (error) {
    console.warn('Failed to trigger revalidation:', error);
    return false;
  }
}