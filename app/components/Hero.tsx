"use client" // Convertir a Client Component para manejar el estado del modal

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CreateProjectModal from "./CreateProjectModal" // Importar el modal
import Image from "next/image"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const carouselItems = [
    {
      id: 1,
      title: "Innovación Digital",
      description: "Creamos soluciones digitales que transforman negocios y experiencias de usuario.",
      image: "/icon-1.png",
    },
    {
      id: 2,
      title: "Diseño Estratégico",
      description: "Cada pixel tiene un propósito, cada interacción está diseñada con intención.",
      image: "/icon-2.png",
    },
    {
      id: 3,
      title: "Desarrollo Tecnológico",
      description: "Construimos con las tecnologías más avanzadas para crear productos escalables y robustos.",
      image: "/icon-3.png",
    },
    {
      id: 4,
      title: "Resultados Medibles",
      description: "Nuestras soluciones generan impacto real y resultados cuantificables para tu negocio.",
      image: "/icon-4.png",
    },
  ]

    // Función para navegar al siguiente slide
    const nextSlide = () => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length)
    }
  
    // Función para navegar al slide anterior
    const prevSlide = () => {
      setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
    }

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
      }, 5000) // cambia cada 5 segundos
    
      return () => clearInterval(interval) // limpiar al desmontar
    }, [carouselItems.length])

  return (
    <>
      <section className="relative text-white min-h-[calc(100vh-4rem-80px)] md:min-h-[calc(100vh-4rem-120px)] flex items-center justify-center text-center py-2 px-4">
        <div className="relative z-10">

    {/* carrucel */}

      <div className=" top-2 left-0 right-0 h-[30vh] md:h-[40vh] z-20 px-4 mb-6">
        <div className="relative h-full max-w-6xl mx-auto rounded-2xl overflow-hidden">
          {/* Controles del carrusel */}
          <div className="absolute top-1/2 left-4 z-30 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full h-12 w-12"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 right-4 z-30 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full h-12 w-12"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Slides del carrusel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="absolute inset-0 flex items-center justify-center"
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 100,
                x: 100,
                rotate: 5,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: 0,
                rotate: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: -100,
                x: -100,
                rotate: -5,
                transition: {
                  duration: 0.3,
                },
              }}
            >
              <Image
                src={carouselItems[activeIndex].image || "/placeholder.svg"}
                alt={carouselItems[activeIndex].title}
                width={100} 
                height={100}
                className="object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{carouselItems[activeIndex].title}</h3>
                <p className="text-lg ">{carouselItems[activeIndex].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicadores de slide */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-2">
            <Button
              size="lg"
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold"
              onClick={() => setIsModalOpen(true)} // Acción para abrir el modal
            >
              Continuar Proyecto
            </Button>
            <Button
              
              variant="outline"
              size="lg"
              className="font-semibold border-gray-200 text-gray-200 bg-transparent hover:bg-white/20 hover:text-white hover:border-white/30"
            >
              <Link href="/portfolio">Ver Portfolio</Link> {/* Asegúrate que href="/portfolio" */}
            </Button>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-50 drop-shadow-xl">
            Experiencias Digitales que Inspiran
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            Creamos soluciones web y móviles a medida que impulsan tu negocio y cautivan a tu audiencia.
          </p>
        </div>
      </section>
      <CreateProjectModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
