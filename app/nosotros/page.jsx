"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Lenis from "@studio-freight/lenis"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Datos para el carrusel
const carouselItems = [
  {
    id: 1,
    title: "Innovación Digital",
    description: "Creamos soluciones digitales que transforman negocios y experiencias de usuario.",
    image: "/images/carousel-1.jpg",
  },
  {
    id: 2,
    title: "Diseño Estratégico",
    description: "Cada pixel tiene un propósito, cada interacción está diseñada con intención.",
    image: "/images/carousel-2.jpg",
  },
  {
    id: 3,
    title: "Desarrollo Tecnológico",
    description: "Construimos con las tecnologías más avanzadas para crear productos escalables y robustos.",
    image: "/images/carousel-3.jpg",
  },
  {
    id: 4,
    title: "Resultados Medibles",
    description: "Nuestras soluciones generan impacto real y resultados cuantificables para tu negocio.",
    image: "/images/carousel-4.jpg",
  },
]

export default function NosotrosPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Valores transformados para animaciones basadas en scroll
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [0, 1, 1])
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.4, 0.5], [0, 1, 1])
  const opacity3 = useTransform(scrollYProgress, [0.4, 0.6, 0.7], [0, 1, 1])
  const opacity4 = useTransform(scrollYProgress, [0.6, 0.8, 0.9], [0, 1, 1])

  const scale1 = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])
  const scale2 = useTransform(scrollYProgress, [0.2, 0.4], [0.8, 1])
  const scale3 = useTransform(scrollYProgress, [0.4, 0.6], [0.8, 1])
  const scale4 = useTransform(scrollYProgress, [0.6, 0.8], [0.8, 1])

  // Inicializar Lenis para scroll suave
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // Función para navegar al siguiente slide
  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length)
  }

  // Función para navegar al slide anterior
  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  // Cambiar slide automáticamente cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      {/* Fondo espacial fijo */}
      <div className="fixed inset-0 w-full h-screen z-0">
        <Image src="/images/space-background.jpg" alt="Fondo espacial" fill className="object-cover" priority />
      </div>

      {/* Indicador de scroll */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
        <ChevronDown className="text-white h-8 w-8" />
      </div>

      {/* Carrusel de imágenes con animación de curva */}
      <div className="fixed top-20 left-0 right-0 h-[40vh] md:h-[50vh] z-20 px-4">
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
              className="absolute inset-0"
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
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{carouselItems[activeIndex].title}</h3>
                <p className="text-lg md:text-xl max-w-2xl">{carouselItems[activeIndex].description}</p>
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

      {/* Sección 1: Misión */}
      <motion.section
        style={{ opacity: opacity1, scale: scale1 }}
        className="fixed inset-0 flex items-center justify-center h-screen w-full px-4 z-10 pt-[30vh] md:pt-[40vh]"
      >
        <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-md p-8 rounded-xl border border-gray-500/30">
          <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">Nuestra Misión</h2>
          <p className="text-xl md:text-2xl text-white mb-8">
            Transformar ideas en experiencias digitales extraordinarias, impulsando el crecimiento de nuestros clientes
            a través de soluciones tecnológicas innovadoras y estratégicas que trascienden las expectativas
            convencionales.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            Contáctanos
          </Button>
        </div>
      </motion.section>

      {/* Sección 2: Visión */}
      <motion.section
        style={{ opacity: opacity2, scale: scale2 }}
        className="fixed inset-0 flex items-center justify-center h-screen w-full px-4 z-10 pt-[30vh] md:pt-[40vh]"
      >
        <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-md p-8 rounded-xl border border-gray-500/30">
          <h2 className="text-4xl md:text-5xl font-bold text-purple-400 mb-6">Nuestra Visión</h2>
          <p className="text-xl md:text-2xl text-white mb-8">
            Ser reconocidos globalmente como un estudio de desarrollo líder en la creación de soluciones digitales que
            definen tendencias, conectando tecnología con creatividad para construir el futuro digital donde otros solo
            ven imposibilidades.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            Conoce Nuestros Proyectos
          </Button>
        </div>
      </motion.section>

      {/* Sección 3: Valores */}
      <motion.section
        style={{ opacity: opacity3, scale: scale3 }}
        className="fixed inset-0 flex items-center justify-center h-screen w-full px-4 z-10 pt-[30vh] md:pt-[40vh]"
      >
        <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-md p-8 rounded-xl border border-gray-500/30">
          <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-6">Nuestros Valores</h2>
          <div className="grid md:grid-cols-2 gap-6 text-white mb-8">
            <div className="bg-black/40 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-amber-300 mb-2">Innovación</h3>
              <p>Exploramos constantemente nuevas tecnologías y enfoques creativos.</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-amber-300 mb-2">Excelencia</h3>
              <p>Nos comprometemos con los más altos estándares en cada proyecto.</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-amber-300 mb-2">Colaboración</h3>
              <p>Trabajamos en estrecha relación con nuestros clientes como verdaderos socios.</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-amber-300 mb-2">Adaptabilidad</h3>
              <p>Evolucionamos rápidamente en un entorno tecnológico cambiante.</p>
            </div>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-full text-lg"
          >
            Únete a Nuestro Equipo
          </Button>
        </div>
      </motion.section>

      {/* Sección 4: Acción */}
      <motion.section
        style={{ opacity: opacity4, scale: scale4 }}
        className="fixed inset-0 flex items-center justify-center h-screen w-full px-4 z-10 pt-[30vh] md:pt-[40vh]"
      >
        <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-md p-8 rounded-xl border border-gray-500/30">
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-400 mb-6">Nuestra Acción</h2>
          <p className="text-xl md:text-2xl text-white mb-8">
            Donde algunos ven dificultad, nosotros vemos oportunidades. Transformamos desafíos en soluciones
            innovadoras, convirtiendo cada proyecto en una historia de éxito a través de estrategias digitales
            personalizadas y tecnología de vanguardia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-full text-lg"
            >
              Inicia Tu Proyecto
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-emerald-400 text-emerald-400 hover:bg-emerald-400/10 font-bold py-3 px-8 rounded-full text-lg"
            >
              Agenda una Consulta
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
