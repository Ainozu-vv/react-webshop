const STORAGE_KEY = "auth:v1";

function safeParseJson(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function getStoredAuth() {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null };
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = safeParseJson(raw, null);
  if (!parsed || typeof parsed !== "object") {
    return { accessToken: null, refreshToken: null };
  }
  return {
    accessToken: typeof parsed.accessToken === "string" ? parsed.accessToken : null,
    refreshToken:
      typeof parsed.refreshToken === "string" ? parsed.refreshToken : null,
  };
}

export function setStoredTokens({ accessToken, refreshToken }) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      accessToken: accessToken ?? null,
      refreshToken: refreshToken ?? null,
    }),
  );
}

export function clearStoredTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
