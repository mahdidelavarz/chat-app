// config.ts
export const getConfig = () => {
    const isDev = process.env.NODE_ENV === 'development';

    return {
        backendUrl: process.env.BACKEND_URL,
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        wsUrl: process.env.NEXT_PUBLIC_WS_URL,
        allowedOrigins: process.env.ALLOWED_ORIGINS
            ? process.env.ALLOWED_ORIGINS.split(',')
            : (isDev ? ['localhost', '127.0.0.1', '172.16.2.99'] : ['yourdomain.com']),
    };
};