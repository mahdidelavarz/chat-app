export const getConfig = () => ({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000',
});