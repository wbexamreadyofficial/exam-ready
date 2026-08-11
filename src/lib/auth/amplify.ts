import { Amplify } from 'aws-amplify';
import { env } from '@/config/env';

export function configureAmplify() {
  if (!env.cognitoUserPoolId || !env.cognitoClientId) {
    console.warn('[Amplify] Cognito configuration missing — auth features will be unavailable in dev mode.');
    return;
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: env.cognitoUserPoolId,
        userPoolClientId: env.cognitoClientId,
        region: env.awsRegion,
        signUpVerificationMethod: 'code',
        loginWith: {
          email: true,
        },
      },
    },
  } as Parameters<typeof Amplify.configure>[0]);
}
