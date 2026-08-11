const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  appName: getEnv('NEXT_PUBLIC_APP_NAME', 'Exam Ready'),
  apiUrl: getEnv('NEXT_PUBLIC_API_URL', 'http://localhost:5000/api'),
  awsRegion: getEnv('NEXT_PUBLIC_AWS_REGION', 'ap-south-1'),
  cognitoUserPoolId: getEnv('NEXT_PUBLIC_COGNITO_USER_POOL_ID', ''),
  cognitoClientId: getEnv('NEXT_PUBLIC_COGNITO_CLIENT_ID', ''),
} as const;
