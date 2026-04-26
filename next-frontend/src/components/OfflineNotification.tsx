'use client';

import { useEffect, useState } from 'react';

export default function OfflineNotification() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        setIsOffline(!navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg text-center z-50">
            You are offline. Messages will be sent when you reconnect.
        </div>
    );
}