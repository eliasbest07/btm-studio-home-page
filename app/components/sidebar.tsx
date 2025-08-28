"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Settings, LogOut, Menu, X, User } from "lucide-react";

type Props = {
  userName?: string | null;
  avatarUrl?: string | null;
};

export default function Sidebar({ userName = "Usuario", avatarUrl }: Props) {
  const pathname = usePathname() || "/profile";
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

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
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/get-user');
        const data = await response.json();
        
        if (response.ok) {
          setUserProfile(data.user.profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

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
          {/* User Profile Card */}
          <div
            className="p-3 rounded-xl text-white"
            style={glassmorphismStyle}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              {(userProfile?.avatar || avatarUrl) ? (
                <img
                  src={userProfile?.avatar || avatarUrl}
                  alt={`${userProfile?.nombre || userName} avatar`}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover border-2 border-white/20"
                />
              ) : (
                <div
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center text-white font-medium border-2 border-white/20 text-xs sm:text-sm"
                  style={{
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8))"
                  }}
                >
                  {(userProfile?.nombre || userName)?.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-medium text-white truncate">
                  {userProfile?.nombre || userName}
                </div>
                <div className="text-xs text-gray-300 flex items-center gap-1">
                  @{userProfile?.username || "tu-perfil"}
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
          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:bg-red-500/20 transition-all duration-200 group"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 group-hover:text-red-400" />
              <span className="truncate">Cerrar sesión</span>
            </button>
          </form>
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
