export interface RateLimit {
  windowMinutes: number;
  maxAttempts: number;
}

export interface AppSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  registrationEnabled: boolean;
  otpLength: number;
  otpExpiryMinutes: number;
  rateLimits: {
    auth: RateLimit;
    contact: RateLimit;
  };
  featureFlags: Record<string, boolean>;
  updatedAt: string | null;
}

export type UpdateAppSettingsInput = Omit<AppSettings, 'updatedAt'>;
