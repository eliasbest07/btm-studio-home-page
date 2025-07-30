"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type LocalProject = {
  tasks: string[]
  projectContext: {
    description: string
    stylePrompt: string
  }
  suggestionId: string | null
  finalImageUrl: string | null
  timestamp: string
}

interface ShowProjectsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function ShowProjectsModal({ isOpen, onOpenChange }: ShowProjectsModalProps) {
  const [projects, setProjects] = useState<LocalProject[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!isOpen) return

    const stored = localStorage.getItem("allProjectPlans")
    if (stored) {
      try {
        const parsed: LocalProject[] = JSON.parse(stored)
        setProjects(parsed)
      } catch (err) {
        console.error("Error al leer los proyectos del localStorage:", err)
      }
    }
  }, [isOpen])

  const handleAccess = (project: LocalProject) => {
    sessionStorage.setItem("projectPlanData", JSON.stringify(project))
    onOpenChange(false)
    router.push("/plan") // O cambia la ruta según lo que uses para cargar proyectos
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white text-black">
        <DialogHeader>
          <DialogTitle>Proyectos Guardados</DialogTitle>
        </DialogHeader>

        {projects.length === 0 ? (
          <p className="text-sm text-gray-500">No hay proyectos guardados localmente.</p>
        ) : (
          <ul className="space-y-4 max-h-[400px] overflow-y-auto">
            {projects.map((project, index) => (
              <li
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {project.projectContext.description || "Proyecto sin nombre"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {project.tasks.length} tareas
                      {project.timestamp && (
                        <> • {new Date(project.timestamp).toLocaleString()}</>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {project.projectContext.stylePrompt}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAccess(project)}
                    className="text-sm font-medium"
                  >
                    Acceder
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
