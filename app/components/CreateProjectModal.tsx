"use client"

import { useRef,useEffect,useState } from "react"
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
  const [projectType, setProjectType] = useState<string>("Lista de Tarea")
  const [projectUtility, setProjectUtility] = useState("")
  const projectTypes = ["Lista de Tarea", "Web app", "Landing Page", "Aplicación Móvil", "Automatización"]
  const [selectedPalette, setSelectedPalette] = useState<string | null>("ninguna")
  const [customColors, setCustomColors] = useState<string[]>(["#ffffff", "#000000", "#cccccc"])
  const colorPalettes = [
  {
    name: "Minimalista",
    colors: ["#f5f5f4", "#d4d4d4", "#a3a3a3"],
  },
  {
    name: "Oscuro Neón",
    colors: ["#0f172a", "#1e293b", "#22d3ee", "#a78bfa"],
  },
  {
    name: "Tropical Vibrante",
    colors: ["#f59e0b", "#10b981", "#ec4899", "#f87171"],
  },
  {
    name: "Lujoso",
    colors: ["#111827", "#78350f", "#facc15"],
  },
  {
    name: "Natural Suave",
    colors: ["#a3b18a", "#588157", "#dad7cd", "#344e41"],
  },
]

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        descriptionRef.current?.focus()
      }, 100) // da un pequeño margen de tiempo
    }
  }, [isOpen])
  const router = useRouter()

  const handleImageSelection = (item: CarouselImageItem) => {
  if (item.alt === "Ningún estilo") {
    setSelectedStyle(null)
  } else if (selectedStyle?.alt === item.alt) {
    setSelectedStyle(null) // Toggle off si ya estaba seleccionado
  } else {
    setSelectedStyle(item)
  }
  setErrorMessage(null)
}



const handleContinue = async () => {
  if (projectDescription.trim() === "") {
    setErrorMessage("Por favor, describe tu proyecto.")
    return
  }

  setErrorMessage(null)
  setIsGeneratingTasks(true)

  try {
    const result = await generateTasksAction(' ', ' ', projectDescription, selectedStyle?.prompt || '')

    const planData = {
      tasks: result.tasks || [], // vacío si hubo error
      projectContext: {
        description: projectDescription,
        stylePrompt: selectedStyle?.prompt || "",
      },
      suggestionId: result.suggestionId || null,
    }

    sessionStorage.setItem("projectPlanData", JSON.stringify(planData))

    // Cierra modal y redirige siempre, con o sin error
    onOpenChange(false)
    router.push("/plan")
  } catch (error) {
    console.error("Error llamando a OpenAI:", error)
    setErrorMessage("No se pudieron generar las tareas, pero puedes continuar.")
    
    // Aún así guarda el contexto básico y avanza
    const fallbackPlan = {
      tasks: [],
      projectContext: {
        description: projectDescription,
        stylePrompt: selectedStyle?.prompt || "",
      },
      suggestionId: null,
    }

    sessionStorage.setItem("projectPlanData", JSON.stringify(fallbackPlan))
    onOpenChange(false)
    router.push("/plan")
  } finally {
    setIsGeneratingTasks(false)
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
  <label className="block text-sm font-medium text-gray-200 mb-2">
    Tipo de proyecto
  </label>
  <div className="flex flex-wrap gap-3">
    {projectTypes.map((type) => (
      <div
        key={type}
        onClick={() => setProjectType(type)}
        className={`cursor-pointer px-4 py-2 rounded-full border text-sm 
          ${
            projectType === type
              ? "bg-white text-gray-900 border-white"
              : "bg-white/5 text-gray-200 border-white/20 hover:bg-white/10"
          } transition-colors duration-150`}
      >
        {type}
      </div>
    ))}
  </div>
</div>
{/* Utilidad del proyecto (opcional) */}
<div>
  <label htmlFor="projectUtility" className="block text-sm font-medium text-gray-200 mb-1.5">
    Describe la utilidad o el uso que va a tener tu proyecto <span className="text-gray-400 italic text-xs">(opcional)</span>
  </label>
  <Textarea
    id="projectUtility"
    placeholder="Ej: Este proyecto permitirá a los usuarios gestionar sus finanzas personales desde el móvil..."
    value={projectUtility}
    onChange={(e) => setProjectUtility(e.target.value)}
    rows={3}
    className="resize-none bg-white/5 focus:ring-yellow-400 text-gray-100 placeholder:text-gray-400"
  />
</div>

{/* Descripción principal del proyecto */}
<div className="rounded-xl bg-white/10 border border-yellow-400/30 p-4 shadow-md transition-shadow hover:shadow-yellow-500/10">
  <label htmlFor="projectDescription" className="block text-sm font-medium text-yellow-300 mb-1.5">
    Describe tu proyecto
  </label>
  <Textarea
    ref={descriptionRef}
    id="projectDescription"
    placeholder="Ej: Necesito una tienda online para vender artesanías, con un diseño moderno y fácil de usar..."
    value={projectDescription}
    onChange={(e) => {
      setProjectDescription(e.target.value)
      setErrorMessage(null)
    }}
    rows={7}
    className="resize-none bg-white/5 focus:ring-yellow-400 border border-yellow-500/20 text-gray-100 placeholder:text-yellow-200 transition-all duration-200"
  />
  {projectType && (
    <p className="text-xs text-yellow-200 mt-1 ml-1">
      Proyecto seleccionado: <span className="text-yellow-100 font-semibold">{projectType}</span>
    </p>
  )}
</div>

<div className="mt-6">
  <label className="block text-sm font-medium text-gray-200 mb-2">Selecciona una paleta de colores</label>

  <div className="flex flex-wrap gap-4">

    {/* Opción "Ninguna" */}
    <div
      className={`cursor-pointer rounded-xl px-4 py-2 border-2 transition-all ${
        selectedPalette === "ninguna" ? "border-yellow-400" : "border-transparent hover:border-gray-400"
      }`}
      onClick={() => setSelectedPalette("ninguna")}
    >
      <p className="text-sm text-gray-300">Sin paleta</p>
    </div>

    {/* Paletas predefinidas */}
    {colorPalettes.map((palette) => (
      <div
        key={palette.name}
        className={`cursor-pointer rounded-xl p-1 border-2 transition-all ${
          selectedPalette === palette.name ? "border-yellow-400" : "border-transparent hover:border-gray-400"
        }`}
        onClick={() => setSelectedPalette(palette.name)}
      >
        <div className="flex space-x-1 rounded-lg overflow-hidden">
          {palette.colors.map((color, idx) => (
            <div key={idx} className="w-6 h-6" style={{ backgroundColor: color }} />
          ))}
        </div>
        <p className="text-xs text-center mt-1 text-gray-300">{palette.name}</p>
      </div>
    ))}

    {/* Paleta personalizada */}
    <div
      className={`cursor-pointer rounded-xl p-2 border-2 transition-all ${
        selectedPalette === "personalizada" ? "border-yellow-400" : "border-transparent hover:border-gray-400"
      }`}
      onClick={() => setSelectedPalette("personalizada")}
    >
      <div className="flex space-x-1">
        {customColors.map((color, idx) => (
          <div key={idx} className="w-6 h-6" style={{ backgroundColor: color }} />
        ))}
      </div>
      <p className="text-xs text-center mt-1 text-gray-300">Personalizada</p>
    </div>
  </div>

  {/* Inputs para la paleta personalizada */}
  {selectedPalette === "personalizada" && (
    <div className="mt-3 flex gap-3 flex-wrap">
      {customColors.map((color, idx) => (
        <input
          key={idx}
          type="color"
          value={color}
          onChange={(e) => {
            const newColors = [...customColors]
            newColors[idx] = e.target.value
            setCustomColors(newColors)
          }}
          className="w-10 h-10 rounded border border-gray-400"
        />
      ))}
      {customColors.length < 4 && (
        <button
          type="button"
          onClick={() => setCustomColors([...customColors, "#888888"])}
          className="text-xs text-gray-200 underline hover:text-yellow-400"
        >
          + Añadir color
        </button>
      )}
    </div>
  )}
</div>



            <div>
              
              <label className="block text-sm font-medium text-gray-200 mb-2">Elige un estilo de inspiración</label>
              <ImageCarousel
  items={[
    {
      src: "/ningun_estilo.png", // una imagen genérica o ícono "sin estilo"
      alt: "Ningún estilo",
      prompt: "", // sin prompt
    },
    ...styleInspirations,
  ]}
                options={{ slidesToScroll: 1 }}
                onImageSelect={handleImageSelection}
                itemsToShow={4}
              />
              {selectedStyle ? (
  <div className="mt-3 p-3 bg-white/5 rounded-md border border-white/10">
    <p className="text-xs text-gray-300">
      <span className="font-semibold text-gray-100">Estilo seleccionado:</span> {selectedStyle.alt}
    </p>
    <p className="text-xs text-gray-400 mt-1">
      <span className="font-semibold text-gray-200">Prompt:</span> {selectedStyle.prompt}
    </p>
  </div>
) : (
  <p className="text-xs text-gray-400 mt-2">No se ha seleccionado ningún estilo de inspiración.</p>
)}


            </div>
            {errorMessage && <p className="text-sm text-red-400 text-center mt-2">{errorMessage}</p>}
          </div>
        </div>
        
        

        <DialogFooter className="sm:justify-end gap-2 flex-shrink-0 px-6 pb-6 pt-4 border-t border-white/10">
          
          <Button
  type="button"
  onClick={handleContinue}
  className="bg-gray-100 hover:bg-gray-200 text-gray-900 min-w-[100px]"
  disabled={isGeneratingTasks || projectDescription.trim() === ""}
>
  {isGeneratingTasks ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continuar"}
</Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
