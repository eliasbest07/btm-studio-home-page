"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Settings, LogOut, Menu, X, User, Calendar } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { clearUserData } from "@/app/utils/userSession";

type Props = {
  userName?: string | null;
  avatarUrl?: string | null;
};

export default function Sidebar({ userName = "Usuario", avatarUrl }: Props) {
  const pathname = usePathname() || "/profile";
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // CSS para ocultar scrollbars
  const hideScrollbarStyle = `
    .hide-scrollbar {
      -ms-overflow-style: none;  /* Internet Explorer 10+ */
      scrollbar-width: none;  /* Firefox */
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;  /* Safari and Chrome */
    }
  `;

  const navItems = [
    { href: "/profile", label: "Inicio", icon: Home, aria: "Ir a inicio" },
    { href: "/profile/settings", label: "Configuración", icon: Settings, aria: "Ir a configuración" },
  ];

  const glassmorphismStyle = {
    background: "rgba(158, 158, 149, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow:
      "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  };

  useEffect(() => {
    // Leer datos del usuario desde localStorage en lugar de API
    const loadUserFromStorage = () => {
      try {
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserProfile(parsedData);
        }
      } catch (error) {
        console.error('Error reading user from localStorage:', error);
      }
    };

    // Cargar datos al montar
    loadUserFromStorage();

    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userData") {
        loadUserFromStorage();
      }
    };

    const handleUserDataChange = () => {
      loadUserFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userData:changed", handleUserDataChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userData:changed", handleUserDataChange);
    };
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevenir clicks múltiples
    
    setIsSigningOut(true);
    console.log("🔐 Iniciando cierre de sesión...");

    try {
      // 1. Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("❌ Error cerrando sesión en Supabase:", error);
      } else {
        console.log("✅ Sesión de Supabase cerrada");
      }

      // 2. Limpiar localStorage (independientemente del resultado de Supabase)
      clearUserData();
      console.log("✅ localStorage limpiado");

      // 3. Redirigir a la página principal
      router.push('/');
      
    } catch (error) {
      console.error("💥 Error crítico cerrando sesión:", error);
      
      // Aún así limpiar localStorage en caso de error
      clearUserData();
      router.push('/');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: hideScrollbarStyle }} />
      
      {/* Mobile header */}
      <div className="flex items-center justify-between p-3 sm:p-4 lg:hidden bg-black/30 border-b border-white/10 flex-shrink-0 w-full">
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={glassmorphismStyle}
          >
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="font-semibold text-white text-sm sm:text-base">Panel</span>
        </div>

        <button
          aria-expanded={open}
          aria-label="Abrir menú"
          onClick={() => setOpen(v => !v)}
          className="text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
          style={glassmorphismStyle}
        >
          {open ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${open ? 'block' : 'hidden'} lg:block
        fixed lg:relative top-0 left-0 z-50 lg:z-auto
        w-full sm:w-80 lg:w-72 h-screen lg:h-full
        flex flex-col bg-black/30 lg:border-r border-white/10 backdrop-blur-sm overflow-hidden hide-scrollbar
        lg:min-h-full
      `}>

      {/* Sidebar content */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden hide-scrollbar">
        {/* Top Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Calendar Button */}
          <Link href="/time">
            <div
              className="p-3 rounded-xl text-white hover:brightness-110 transition-all duration-200 cursor-pointer group"
              style={glassmorphismStyle}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center text-white border-2 border-white/20 group-hover:border-white/40 transition-colors">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-medium text-white truncate group-hover:text-gray-100">
                    Calendario
                  </div>
                  <div className="text-xs text-gray-300 flex items-center gap-1 group-hover:text-gray-200">
                    Ver tu itinerario
                    {userProfile?.nivel !== undefined && (
                      <>
                        <span>•</span>
                        <span className="text-yellow-400">Nv.{userProfile.nivel}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1 sm:space-y-2" aria-label="Navegación principal">
            {navItems.map(item => {
              const active = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
                    ${active
                      ? "text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                    }
                  `}
                  style={active ? glassmorphismStyle : {}}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.aria}
                  onClick={() => setOpen(false)} // Close mobile menu on navigation
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Spacer to push bottom content down */}
        <div className="flex-1" />

        {/* Bottom Content */}
        <div className="space-y-3">
          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:bg-red-500/20 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 group-hover:text-red-400 ${isSigningOut ? 'animate-spin' : ''}`} />
            <span className="truncate">
              {isSigningOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </span>
          </button>
        </div>
       
      </div>
    </aside>
      
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
