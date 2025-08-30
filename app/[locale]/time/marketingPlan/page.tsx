"use client";
import WeeklyGlobalEvent from "../../../components/calendario_plan";

export default function Page() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background decorativo optimizado para móvil */}
      <div className="fixed inset-0 -z-10">
        <div className="background blue-purple opacity-70"></div>
        <div className="background green-blue opacity-70"></div>

        {/* Círculos decorativos reducidos para móvil */}
        <div className="hidden sm:block">
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>

      {/* Contenedor principal optimizado para móvil */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header con padding responsivo */}
        <div className="flex-shrink-0 p-2 sm:p-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white text-center mb-2 sm:mb-4">
            Plan de Marketing
          </h1>
        </div>

        {/* Calendario con scroll oculto */}
        <div className="flex-1 mx-2 sm:mx-4 mb-2 sm:mb-4 rounded-lg border border-gray-200/50 shadow-lg bg-white/95 backdrop-blur-sm overflow-hidden">
          <div className="h-full overflow-y-scroll scrollbar-hide">
            <WeeklyGlobalEvent />
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}
