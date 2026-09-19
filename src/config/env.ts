// NEXT_PUBLIC_* values are only inlined into the browser bundle when accessed
// as a literal `process.env.NEXT_PUBLIC_X` — dynamic `process.env[key]` reads
// are always undefined client-side, so each variable is read explicitly.
const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'https://exam-ready-node.vercel.app/api').trim();

/** http(s)://host/api  ->  ws(s)://host/ws — the backend serves sockets at /ws on the same host. */
function deriveSocketUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol === 'https:' ? 'wss:' : 'ws:'}//${parsed.host}/ws`;
  } catch {
    return '';
  }
}

export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Exam Ready',
  apiUrl,
  wsUrl: (process.env.NEXT_PUBLIC_WS_URL ?? '').trim() || deriveSocketUrl(apiUrl),
} as const;
