'use client';

import { useEffect, useState } from 'react';

export default function BackendTest() {
  const [status, setStatus] = useState<string>('Testing...');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testBackend = async () => {
      try {
        // Test direct connection
        const response = await fetch('http://localhost:5000/health');
        if (response.ok) {
          const data = await response.json();
          setStatus(`Connected ✅ - ${JSON.stringify(data)}`);
        } else {
          setStatus(`Error: ${response.status}`);
        }
      } catch (err: any) {
        setStatus(`Failed ❌ - ${err.message}`);
        setError('Make sure backend is running on http://localhost:5000');
      }
    };

    testBackend();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg text-xs z-50">
      <div>Backend Status: {status}</div>
      {error && <div className="text-red-400 mt-1">{error}</div>}
    </div>
  );
}