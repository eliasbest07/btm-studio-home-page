"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function GlobalLoadingSpinner() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar si hay un loading activo al montar el componente
    const checkLoading = () => {
      const loading = sessionStorage.getItem("projectLoading");
      setIsLoading(loading === "true");
    };

    // Verificar inmediatamente
    checkLoading();

    // Escuchar cambios en sessionStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "projectLoading") {
        setIsLoading(e.newValue === "true");
      }
    };

    // Escuchar cambios en la misma pestaña
    const handleCustomStorageChange = () => {
      checkLoading();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("projectLoadingChange", handleCustomStorageChange);

    // Limpiar cuando la página esté completamente cargada
    const handlePageLoad = () => {
      if (document.readyState === 'complete') {
        setTimeout(() => {
          sessionStorage.removeItem("projectLoading");
          setIsLoading(false);
        }, 500);
      }
    };

    // Verificar si ya está cargada
    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad);
    }

    // Limpiar el loading después de 8 segundos como fallback
    const fallbackTimeout = setTimeout(() => {
      sessionStorage.removeItem("projectLoading");
      setIsLoading(false);
    }, 8000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("projectLoadingChange", handleCustomStorageChange);
      window.removeEventListener('load', handlePageLoad);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  // Limpiar el loading cuando se detecta que la página se ha cargado completamente
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        sessionStorage.removeItem("projectLoading");
        setIsLoading(false);
      }, 1500); // 3 segundos después de que se monte el componente (reducido)

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-slate-900/90 border border-slate-700">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Cargando proyecto...
          </h3>
          <p className="text-sm text-slate-300">
            Preparando tu espacio de trabajo
          </p>
        </div>
      </div>
    </div>
  );
}