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

// Función para verificar si hay una sesión válida (debe ser llamada desde componentes que usen Supabase)
export const isUserSessionValid = (): boolean => {
  try {
    const userData = readUserData();
    const loggedIn = localStorage.getItem("loggedIn");
    return !!(userData && loggedIn);
  } catch {
    return false;
  }
};

// Función para verificar sesión de Supabase cuando sea necesario
export const verifySupabaseSession = async (supabaseClient: any, forceCheck = false): Promise<boolean> => {
  try {
    // Solo verificar si hace más de 1 hora o se fuerza
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    const lastCheck = parseInt(localStorage.getItem("lastSessionCheck") || "0");
    
    if (!forceCheck && (now - lastCheck) < ONE_HOUR) {
      console.log("⏭️ Sesión verificada recientemente, asumiendo válida");
      return true;
    }
    
    console.log("🔍 Verificando sesión de Supabase...");
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error || !session?.user) {
      console.warn("⚠️ Sesión de Supabase expirada o inválida");
      clearUserData(); // Limpiar datos locales
      localStorage.removeItem("lastSessionCheck");
      return false;
    }
    
    // Actualizar timestamp de verificación
    localStorage.setItem("lastSessionCheck", now.toString());
    console.log("✅ Sesión de Supabase válida");
    return true;
  } catch (error) {
    console.error("Error verificando sesión de Supabase:", error);
    return false;
  }
};

// Hook para usar antes de acciones críticas
export const ensureValidSession = async (supabaseClient: any, forceCheck = false): Promise<boolean> => {
  // Primero verificar localStorage
  if (!isUserSessionValid()) {
    return false;
  }
  
  // Luego verificar Supabase solo si es necesario
  return await verifySupabaseSession(supabaseClient, forceCheck);
};
