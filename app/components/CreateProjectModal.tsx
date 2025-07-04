"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ImageCarousel, { type CarouselImageItem } from "./ImageCarousel"
import { generateTasksAction } from "@/app/actions/openai-actions"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreateProjectModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const styleInspirations: CarouselImageItem[] = [
  {
    src: "/minimalist-neutral.webp",
    alt: "Estilo Minimalista y Neutral",
    prompt:
      "Diseño web minimalista con paleta de colores neutrales (beige, gris claro, blanco roto), líneas limpias, amplio espacio en blanco, tipografía sofisticada y sombras sutiles.",
  },
  {
    src: "/dark-modern-tech.webp",
    alt: "Estilo Oscuro, Moderno y Tecnológico",
    prompt:
      "Interfaz de sitio web tecnológico moderno en modo oscuro, color de acento vibrante (azul eléctrico o verde neón), tipografía elegante, patrones geométricos, elementos brillantes, profesional e innovador.",
  },
  {
    src: "/vibrant-playful.webp",
    alt: "Estilo Vibrante y Juguetón",
    prompt:
      "Diseño web vibrante y juguetón, paleta de colores brillantes (amarillo, rosa, turquesa), formas orgánicas, ilustraciones personalizadas, tipografía amigable, enérgico y atractivo.",
  },
  {
    src: "/elegant-luxury.webp",
    alt: "Estilo Elegante y Lujoso",
    prompt:
      "Diseño web de marca de lujo elegante, colores intensos y profundos (burdeos, dorado, negro), tipografía serif, fotografía de producto de alta calidad, diseño sofisticado, sensación premium.",
  },
  {
    src: "/eco-natural.webp",
    alt: "Estilo Ecológico y Natural",
    prompt:
      "Sitio web de producto natural y ecológico, tonos tierra (verdes, marrones, cremas), fondos texturizados, fuentes de estilo orgánico o manuscrito, imágenes inspiradas en la naturaleza, limpio y confiable.",
  },
  {
    src: "/retro-futuristic.webp",
    alt: "Estilo Retro-Futurista",
    prompt:
      "Diseño web retro-futurista, estética synthwave de los 80, rosas y morados neón, líneas de cuadrícula, elementos pixelados, efectos de texto cromados, nostálgico pero moderno.",
  },
]

export default function CreateProjectModal({ isOpen, onOpenChange }: CreateProjectModalProps) {
  const [projectDescription, setProjectDescription] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<CarouselImageItem | null>(null)
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleImageSelection = (item: CarouselImageItem) => {
    setSelectedStyle(item)
    setErrorMessage(null)
  }

  const handleContinue = async () => {
    if (!selectedStyle) {
      setErrorMessage("Por favor, selecciona un estilo de inspiración.")
      return
    }
    if (projectDescription.trim() === "") {
      setErrorMessage("Por favor, describe tu proyecto.")
      return
    }
    setErrorMessage(null)
    setIsGeneratingTasks(true)

    const result = await generateTasksAction(projectDescription, selectedStyle.prompt)

    setIsGeneratingTasks(false)

    if (result.error) {
      setErrorMessage(result.error)
    } else if (result.tasks) {
      const planData = {
        tasks: result.tasks,
        projectContext: {
          description: projectDescription,
          stylePrompt: selectedStyle.prompt,
        },
        suggestionId: result.suggestionId,
      }
      try {
        sessionStorage.setItem("projectPlanData", JSON.stringify(planData))
        onOpenChange(false)
        router.push("/plan")
      } catch (error) {
        console.error("Error saving to sessionStorage:", error)
        setErrorMessage("No se pudo guardar el plan del proyecto. Intenta de nuevo.")
      }
    } else {
      setErrorMessage("No se pudieron generar las tareas. Intenta de nuevo.")
    }
  }

  const handleCloseThisModal = (open: boolean) => {
    if (!open) {
      setProjectDescription("")
      setSelectedStyle(null)
      setErrorMessage(null)
    }
    onOpenChange(open)
  }

  

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseThisModal}>
      <DialogContent
        className="sm:max-w-2xl md:max-w-3xl text-gray-100 border-glass-border flex flex-col"
        style={{
          background: "rgba(30, 30, 28, 0.9)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          maxHeight: "90vh",
        }}
      >
        <DialogHeader className="flex-shrink-0 px-6 pt-6">
          <DialogTitle className="text-2xl font-bold text-center text-gray-50">Cuéntanos sobre tu Proyecto</DialogTitle>
          <DialogDescription className="text-center text-gray-300 pb-2">
            Describe tu idea y selecciona un estilo de inspiración para comenzar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto px-6 custom-scrollbar">
          <div className="grid gap-6 py-4">
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-200 mb-1.5">
                Describe tu proyecto
              </label>
              <Textarea
                id="projectDescription"
                placeholder="Ej: Necesito una tienda online para vender artesanías, con un diseño moderno y fácil de usar..."
                value={projectDescription}
                onChange={(e) => {
                  setProjectDescription(e.target.value)
                  setErrorMessage(null)
                }}
                rows={4}
                className="bg-white/5 border-white/20 focus:ring-gray-400 text-gray-100 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Elige un estilo de inspiración</label>
              <ImageCarousel
                items={styleInspirations}
                options={{ slidesToScroll: 1 }}
                onImageSelect={handleImageSelection}
                itemsToShow={4}
              />
              {selectedStyle && (
                <div className="mt-3 p-3 bg-white/5 rounded-md border border-white/10">
                  <p className="text-xs text-gray-300">
                    <span className="font-semibold text-gray-100">Estilo seleccionado:</span> {selectedStyle.alt}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    <span className="font-semibold text-gray-200">Prompt:</span> {selectedStyle.prompt}
                  </p>
                </div>
              )}
            </div>
            {errorMessage && <p className="text-sm text-red-400 text-center mt-2">{errorMessage}</p>}
          </div>
        </div>

        <DialogFooter className="sm:justify-end gap-2 flex-shrink-0 px-6 pb-6 pt-4 border-t border-white/10">
          <DialogClose asChild>
            <Button  
              asChild={false}
              type="button"
              variant="outline"
              className="bg-gray-600 text-gray-200 border-transparent hover:bg-transparent hover:border-gray-400 hover:text-gray-200"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleContinue}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 min-w-[100px]"
            disabled={isGeneratingTasks}
          >
            {isGeneratingTasks ? <Loader2 className="h-4 w-4 animate-spin" /> : "Seguir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
