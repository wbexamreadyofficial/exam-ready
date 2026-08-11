import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  resetPassword,
  confirmResetPassword,
  getCurrentUser,
  fetchAuthSession,
} from 'aws-amplify/auth';

export interface CognitoSignInResult {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export const cognitoAuth = {
  signIn: async (email: string, password: string): Promise<CognitoSignInResult> => {
    await signIn({ username: email, password });
    const session = await fetchAuthSession();
    const tokens = session.tokens;
    if (!tokens?.accessToken || !tokens?.idToken) {
      throw new Error('Failed to retrieve auth tokens');
    }
    return {
      accessToken: tokens.accessToken.toString(),
      idToken: tokens.idToken.toString(),
      refreshToken: '',
    };
  },

  signUp: async (email: string, password: string, name: string): Promise<void> => {
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name,
        },
      },
    });
  },

  confirmSignUp: async (email: string, code: string): Promise<void> => {
    await confirmSignUp({ username: email, confirmationCode: code });
  },

  signOut: async (): Promise<void> => {
    await signOut();
  },

  forgotPassword: async (email: string): Promise<void> => {
    await resetPassword({ username: email });
  },

  confirmResetPassword: async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<void> => {
    await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
  },

  getCurrentUser: async (): Promise<{ username: string; userId: string } | null> => {
    try {
      return await getCurrentUser();
    } catch {
      return null;
    }
  },

  getSession: async (): Promise<{ accessToken: string; idToken: string } | null> => {
    try {
      const session = await fetchAuthSession();
      const tokens = session.tokens;
      if (!tokens?.accessToken || !tokens?.idToken) return null;
      return {
        accessToken: tokens.accessToken.toString(),
        idToken: tokens.idToken.toString(),
      };
    } catch {
      return null;
    }
  },
};
