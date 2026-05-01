const TOKEN_KEY = 'collectflowai_access_token';
const USER_KEY = 'collectflowai_user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

export type LoginResult = {
  accessToken: string;
  expiresAtUtc: string;
  email: string;
  role: string;
  tenantId: string;
};

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function getUser(): { email: string; role: string } | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as LoginResult;

  setToken(data.accessToken);
  sessionStorage.setItem(USER_KEY, JSON.stringify({
    email: data.email,
    role: data.role,
    tenantId: data.tenantId
  }));

  return true;
}

export function logout(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
