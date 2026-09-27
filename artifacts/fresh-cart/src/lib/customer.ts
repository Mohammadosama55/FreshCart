const CLIENT_ID_KEY = 'freshcart-client-id';

function createFallbackClientId() {
  return `fc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`;
}

export function getClientId(): string {
  if (typeof window === 'undefined') return 'fc_server_placeholder';

  const stored = window.localStorage.getItem(CLIENT_ID_KEY);
  if (stored && stored.length >= 16) return stored;

  const generated = typeof window.crypto?.randomUUID === 'function'
    ? window.crypto.randomUUID()
    : createFallbackClientId();

  window.localStorage.setItem(CLIENT_ID_KEY, generated);
  return generated;
}