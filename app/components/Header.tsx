"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateProjectModal from "./CreateProjectModal";
import { useTranslations } from "next-intl";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const t = useTranslations("header");
  const pathname = usePathname();

  useEffect(() => {
  const leerUsuario = () => {
    try {
      const raw = localStorage.getItem("userData");
      setNombreUsuario(raw ? (JSON.parse(raw)?.nombre ?? "") : "");
    } catch {
      setNombreUsuario("");
    }
  };

  const onFocus = () => leerUsuario();
  const onVisibility = () => leerUsuario();
  const onStorage = (e: StorageEvent) => {
    if (e.key === "userData") leerUsuario();
  };
  const onChanged = () => leerUsuario(); // evento personalizado mismo tab

  leerUsuario(); // al montar

  window.addEventListener("focus", onFocus);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("storage", onStorage); // otras pestañas
  window.addEventListener("userData:changed", onChanged); // misma pestaña

  return () => {
    window.removeEventListener("focus", onFocus);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("userData:changed", onChanged);
  };
}, []);

useEffect(() => {
  // re-lee al cambiar de ruta
  try {
    const raw = localStorage.getItem("userData");
    setNombreUsuario(raw ? (JSON.parse(raw)?.nombre ?? "") : "");
  } catch {
    setNombreUsuario("");
  }
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

            {nombreUsuario && (
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
