const SESSION_KEY = "sin_japan_admin_auth";

export function login(email: string, password: string): boolean {
  const validEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const validPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  if (email === validEmail && password === validPassword) {
    sessionStorage.setItem(SESSION_KEY, "authenticated");
    return true;
  }
  return false;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "authenticated";
}
