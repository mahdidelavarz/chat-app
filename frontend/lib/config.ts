export const config = {
  backendUrl: process.env.BACKEND_URL,
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  wsUrl: process.env.NEXT_PUBLIC_WS_URL,
  appEnv: process.env.NEXT_PUBLIC_APP_ENV,
};

// Helper to know which database is being used
export const isUsingPostgres = config.appEnv === 'postgres';
export const isUsingSqlServer = config.appEnv === 'sqlserver';