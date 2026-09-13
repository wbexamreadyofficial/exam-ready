const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  appName: getEnv('NEXT_PUBLIC_APP_NAME', 'Exam Ready'),
  apiUrl: getEnv('NEXT_PUBLIC_API_URL', 'https://exam-ready-node.vercel.app/api'),
} as const;
