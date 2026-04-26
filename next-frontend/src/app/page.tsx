'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Use router.replace instead of push to avoid back button issues
    router.replace('/login');
  }, [router]);
  
  // Return null or a simple div - don't show loading
  return null;
}