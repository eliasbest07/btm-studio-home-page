// Utilidad centralizada para leer/escribir userData y avisar cambios
export type UserData = {
  nombre?: string;
  idea?: string;
  avatar?: string;
  role?: string;
  correo?: string;
  admin?: boolean;
};

const KEY = "userData";
const EVT = "userData:changed";

export const readUserData = (): UserData | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveUserData = (data: UserData) => {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(EVT));
};

export const clearUserData = () => {
  localStorage.removeItem(KEY);
  localStorage.removeItem("loggedIn");
  window.dispatchEvent(new Event(EVT));
};
