export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">📡</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">You are offline</h1>
        <p className="text-gray-600">
          Please check your internet connection and try again.
        </p>
      </div>
    </div>
  );
}