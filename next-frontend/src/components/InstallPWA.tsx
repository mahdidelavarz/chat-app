'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Install Chat App</h3>
          <p className="text-sm opacity-90">Install for a better experience</p>
        </div>
        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-white text-blue-500 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  );
}