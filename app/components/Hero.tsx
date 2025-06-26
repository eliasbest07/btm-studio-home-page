"use client" // Convertir a Client Component para manejar el estado del modal

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CreateProjectModal from "./CreateProjectModal" // Importar el modal

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="relative text-white min-h-[calc(100vh-4rem-80px)] md:min-h-[calc(100vh-4rem-120px)] flex items-center justify-center text-center py-20 px-4">
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-50 drop-shadow-xl">
            Experiencias Digitales que Inspiran
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            Creamos soluciones web y móviles a medida que impulsan tu negocio y cautivan a tu audiencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold"
              onClick={() => setIsModalOpen(true)} // Acción para abrir el modal
            >
              Empezar Proyecto
            </Button>
            <Button
              
              variant="outline"
              size="lg"
              className="font-semibold border-gray-200 text-gray-200 bg-transparent hover:bg-white/20 hover:text-white hover:border-white/30"
            >
              <Link href="/portfolio">Ver Portfolio</Link> {/* Asegúrate que href="/portfolio" */}
            </Button>
          </div>
        </div>
      </section>
      <CreateProjectModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
