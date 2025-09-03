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
  const t = useTranslations("header");
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  // Función para verificar sesión de Supabase y sincronizar con localStorage
  const verificarYSincronizarSesion = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error verificando sesión:", error);
        setIsSessionValid(false);
        setNombreUsuario("");
        // Limpiar localStorage si hay error de sesión
        localStorage.removeItem("userData");
        localStorage.removeItem("loggedIn");
        return;
      }

      if (session?.user) {
        // Hay sesión válida de Supabase
        setIsSessionValid(true);
        
        // Ahora leer datos del usuario desde localStorage
        try {
          const raw = localStorage.getItem("userData");
          setNombreUsuario(raw ? (JSON.parse(raw)?.nombre ?? "") : "");
        } catch {
          setNombreUsuario("");
        }
      } else {
        // No hay sesión de Supabase, limpiar todo
        console.log("No hay sesión activa de Supabase");
        setIsSessionValid(false);
        setNombreUsuario("");
        localStorage.removeItem("userData");
        localStorage.removeItem("loggedIn");
      }
    } catch (error) {
      console.error("Error en verificarYSincronizarSesion:", error);
      setIsSessionValid(false);
      setNombreUsuario("");
      localStorage.removeItem("userData");
      localStorage.removeItem("loggedIn");
    }
  };

  useEffect(() => {
    const onFocus = () => verificarYSincronizarSesion();
    const onVisibility = () => verificarYSincronizarSesion();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "userData") verificarYSincronizarSesion();
    };
    const onChanged = () => verificarYSincronizarSesion(); // evento personalizado mismo tab

    // Verificar al montar el componente
    verificarYSincronizarSesion();

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage); // otras pestañas
    window.addEventListener("userData:changed", onChanged); // misma pestaña

    // Escuchar cambios de autenticación de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Cambio en estado de auth:", event);
      verificarYSincronizarSesion();
    });

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("userData:changed", onChanged);
      subscription.unsubscribe();
    };
  }, []);

useEffect(() => {
  // re-verificar sesión al cambiar de ruta
  verificarYSincronizarSesion();
}, [pathname]);

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
