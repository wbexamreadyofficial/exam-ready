import type { LoginRecord } from '@/types/user';

const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export function parseDate(value?: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value?: string): string {
  const date = parseDate(value);
  return date ? dateFormatter.format(date) : '—';
}

export function formatDateTime(value?: string): string {
  const date = parseDate(value);
  return date ? dateTimeFormatter.format(date).toUpperCase() : '—';
}

export function timeAgo(value?: string): string {
  const date = parseDate(value);
  if (!date) return 'Never';
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  const units: [number, string][] = [
    [60 * 60 * 24 * 365, 'year'],
    [60 * 60 * 24 * 30, 'month'],
    [60 * 60 * 24, 'day'],
    [60 * 60, 'hour'],
    [60, 'minute'],
  ];
  for (const [size, label] of units) {
    if (seconds >= size) {
      const count = Math.floor(seconds / size);
      return `${count} ${label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}

export function describeUserAgent(userAgent?: string): string {
  if (!userAgent) return 'Unknown device';
  const browser = /Edg\//.test(userAgent)
    ? 'Edge'
    : /OPR\//.test(userAgent)
      ? 'Opera'
      : /Chrome\//.test(userAgent)
        ? 'Chrome'
        : /Firefox\//.test(userAgent)
          ? 'Firefox'
          : /Safari\//.test(userAgent)
            ? 'Safari'
            : /okhttp|dart|expo|reactnative/i.test(userAgent)
              ? 'Mobile app'
              : 'Unknown browser';
  const os = /Windows/.test(userAgent)
    ? 'Windows'
    : /Android/.test(userAgent)
      ? 'Android'
      : /iPhone|iPad|iOS/.test(userAgent)
        ? 'iOS'
        : /Mac OS X/.test(userAgent)
          ? 'macOS'
          : /Linux/.test(userAgent)
            ? 'Linux'
            : '';
  return os ? `${browser} on ${os}` : browser;
}

export function describeLocation(login: LoginRecord): string {
  const parts = [login.ipInfo.city, login.ipInfo.region, login.ipInfo.country].filter(Boolean);
  return parts.length ? parts.join(', ') : 'Location unavailable';
}

/** True for native-app clients and phone/tablet browsers. */
export function isMobileDevice(userAgent?: string): boolean {
  return !!userAgent && /okhttp|dart|expo|reactnative|android|iphone|ipad|ios|mobile/i.test(userAgent);
}

/** How someone signed in — NOT the device they used. */
export const LOGIN_METHOD_LABEL = { otp: 'OTP', mobile: 'Phone number' } as const;

export const LOGIN_METHOD_HINT = {
  otp: 'Signed in by entering a one-time code',
  mobile: 'Signed in with just the phone number (no code)',
} as const;
