import { jwtDecode } from "jwt-decode";

export const saveAuth = (token: string, role: string, name: string | null) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  if (name) localStorage.setItem("name", name);
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
  document.cookie = `role=${role}; path=/; max-age=86400; SameSite=Strict`;
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const getRole = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role");
};

export const getName = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("name");
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
