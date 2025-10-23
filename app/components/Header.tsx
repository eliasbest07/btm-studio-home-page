"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateProjectModal from "./CreateProjectModal";
import { useTranslations } from "next-intl";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastSessionCheck, setLastSessionCheck] = useState(0); // Timestamp de última verificación
  const t = useTranslations("header");
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  // Función que lee localStorage inmediatamente y verifica sesión periódicamente
  const verificarYSincronizarSesion = async (forceSessionCheck = false) => {
    if (isVerifying) return;
    
    setIsVerifying(true);
    try {
      // Leer datos locales primero (siempre rápido)
      const localUserData = localStorage.getItem("userData");
      const isLoggedIn = localStorage.getItem("loggedIn");
      
      if (localUserData && isLoggedIn) {
        // Mostrar datos inmediatamente
        setIsSessionValid(true);
        try {
          const userData = JSON.parse(localUserData);
          setNombreUsuario(userData?.nombre ?? "");
          console.log("✅ Mostrando usuario desde localStorage:", userData?.nombre);
        } catch {
          setNombreUsuario("");
          setIsSessionValid(false);
          return;
        }

        // Verificar sesión de Supabase solo si hace más de 1 hora desde la última verificación
        const now = Date.now();
        const ONE_HOUR = 60 * 60 * 1000;
        
        // Obtener timestamp de última verificación desde localStorage
        const lastCheck = parseInt(localStorage.getItem("lastSessionCheck") || "0");
        
        if (forceSessionCheck || (now - lastCheck) > ONE_HOUR) {
          console.log("🔍 Verificando sesión de Supabase (última verificación hace más de 1 hora)...");
          
          // Guardar timestamp de verificación en localStorage
          localStorage.setItem("lastSessionCheck", now.toString());
          setLastSessionCheck(now);
          
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error || !session?.user) {
              // Sesión expirada o inválida
              console.warn("⚠️ Sesión de Supabase expirada, limpiando datos locales");
              setIsSessionValid(false);
              setNombreUsuario("");
              localStorage.removeItem("userData");
              localStorage.removeItem("loggedIn");
              localStorage.removeItem("lastSessionCheck");
              window.dispatchEvent(new Event("userData:changed"));
            } else {
              console.log("✅ Sesión de Supabase válida");
            }
          } catch (sessionError) {
            console.error("Error verificando sesión de Supabase:", sessionError);
            // No limpiar inmediatamente por errores de red, mantener datos locales
          }
        } else {
          console.log("⏭️ Sesión verificada recientemente, omitiendo verificación");
        }
      } else {
        // No hay datos locales
        setIsSessionValid(false);
        setNombreUsuario("");
      }
    } catch (error) {
      console.error("Error en verificarYSincronizarSesion:", error);
      setIsSessionValid(false);
      setNombreUsuario("");
    } finally {
      setIsVerifying(false);
    }
  };


  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "userData" || e.key === "loggedIn") {
        verificarYSincronizarSesion();
      }
    };
    
    const onChanged = () => verificarYSincronizarSesion();
    
    // Listener para verificar sesión cuando se hace focus (usuario vuelve a la tab)
    const onFocus = () => {
      // Solo verificar si hay datos locales
      const localUserData = localStorage.getItem("userData");
      if (localUserData) {
        verificarYSincronizarSesion(true); // Forzar verificación
      }
    };

    // Verificar al montar
    verificarYSincronizarSesion();

    // Listeners
    window.addEventListener("storage", onStorage); 
    window.addEventListener("userData:changed", onChanged);
    window.addEventListener("focus", onFocus); // Verificar al volver a la tab

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("userData:changed", onChanged);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

// Eliminar el useEffect de pathname para evitar verificaciones excesivas

  // If you clear userData in this same tab, also do:
  // localStorage.removeItem("userData"); setNombreUsuario("");

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(25, 25, 22, 0.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <nav className="container mx-auto flex justify-between items-center h-16 px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/btm-studio-logo.png"
                alt="BTM Studio Logo - Diamante y Orbes Abstractos"
                width={36}
                height={36}
                className="rounded-md"
              />
              <span className="font-bold text-lg text-gray-100">BTM-Studio</span>
            </Link>

            {isSessionValid && nombreUsuario && (
              <Link href="/profile" className="text-gray-200 hover:text-white underline">
                /{nombreUsuario}
              </Link>
            )}
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-2.5"
          >
            {t("createProject")}
          </Button>
        </nav>
      </header>
      <CreateProjectModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
