"use client"

import { useState } from "react"
import { LayoutDashboard, Users, FileText, Settings, ChevronRight, Folder } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  const projects = [
    {
      id: 1,
      name: "Proyecto Alpha",
      description: "Sistema de gestión de inventario con análisis predictivo.",
      color: "bg-rose-100",
    },
    {
      id: 2,
      name: "Proyecto Beta",
      description: "Plataforma de comercio electrónico con integración de pagos.",
      color: "bg-blue-100",
    },
    {
      id: 3,
      name: "Proyecto Gamma",
      description: "Aplicación móvil para seguimiento de actividades físicas.",
      color: "bg-amber-100",
    },
    {
      id: 4,
      name: "Proyecto Delta",
      description: "Portal de aprendizaje en línea con contenido interactivo.",
      color: "bg-emerald-100",
    },
  ]

  const handleProjectClick = (id) => {
    setSelectedProject(id)
  }

  const handleProjectsMenuClick = () => {
    setSelectedProject(null)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className={cn(
                  "flex items-center p-3 rounded-md hover:bg-gray-100",
                  selectedProject === null ? "bg-gray-100 text-rose-600 font-medium" : "text-gray-700",
                )}
                onClick={handleProjectsMenuClick}
              >
                <Folder className="w-5 h-5 mr-3" />
                <span>Proyectos</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100">
                <Users className="w-5 h-5 mr-3" />
                <span>Usuarios</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100">
                <FileText className="w-5 h-5 mr-3" />
                <span>Reportes</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100">
                <Settings className="w-5 h-5 mr-3" />
                <span>Configuración</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {selectedProject === null ? (
            <>
              <h1 className="text-2xl font-bold mb-6">Proyectos</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "cursor-pointer rounded-lg p-6 shadow-sm border transition-all hover:shadow-md",
                      project.color,
                    )}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {projects
                .filter((project) => project.id === selectedProject)
                .map((project) => (
                  <div key={project.id}>
                    <div className="flex items-center mb-4">
                      <button
                        onClick={handleProjectsMenuClick}
                        className="text-rose-600 hover:text-rose-700 font-medium flex items-center"
                      >
                        Proyectos
                      </button>
                      <span className="mx-2 text-gray-400">/</span>
                      <h1 className="text-2xl font-bold">{project.name}</h1>
                    </div>

                    <div className={cn("rounded-lg p-6 mb-6", project.color)}>
                      <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                      <p className="text-gray-700">{project.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg border p-6">
                        <h3 className="font-semibold mb-2">Progreso</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-rose-600 h-2.5 rounded-full w-2/3"></div>
                        </div>
                        <p className="text-right text-sm text-gray-500 mt-1">66%</p>
                      </div>

                      <div className="bg-white rounded-lg border p-6">
                        <h3 className="font-semibold mb-2">Miembros</h3>
                        <p className="text-gray-700">8 miembros activos</p>
                      </div>

                      <div className="bg-white rounded-lg border p-6">
                        <h3 className="font-semibold mb-2">Fecha límite</h3>
                        <p className="text-gray-700">15 de Diciembre, 2023</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
