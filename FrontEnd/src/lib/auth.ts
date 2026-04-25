const TOKEN_KEY = 'recoverai_access_token';
const USER_KEY = 'recoverai_user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001';

export type LoginResult = {
  accessToken: string;
  expiresAtUtc: string;
  email: string;
  role: string;
};

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function getUser(): { email: string; role: string } | null {
  const raw = localStorage.getItem(USER_KEY);
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

  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify({
    email: data.email,
    role: data.role
  }));

  return true;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
