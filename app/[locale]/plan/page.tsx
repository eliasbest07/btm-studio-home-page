"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PlanBasePage() {
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay datos en sessionStorage
    const storedData = sessionStorage.getItem("projectPlanData")
    if (storedData) {
      // Si hay datos, redirigir a un ID temporal para mantener el comportamiento original
      router.push("/plan/session")
    } else {
      // Solo limpiar el loading si no hay datos (no hay redirección)
      setTimeout(() => {
        sessionStorage.removeItem("projectLoading")
        window.dispatchEvent(new Event("projectLoadingChange"))
      }, 800)
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-100 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">Plan de Proyecto</h1>
        <p className="text-gray-300 mb-8">
          Para acceder a un plan de proyecto específico, usa la URL con el ID:
          <br />
          <code className="text-green-400">/plan/123</code> (para ID numérico) o 
          <br />
          <code className="text-green-400">/plan/mi-producto</code> (para clave de producto)
        </p>
        
        <Button
          asChild                
          className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(158,158,149,0.7)] hover:brightness-110 transition-all duration-200"
          style={{
            background: 'rgba(158, 158, 149, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow:
              '2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: '20px',
          }}
        >
          <Link href="/">⬅ Volver al Inicio</Link>
        </Button>
      </div>
    </div>
  )
}