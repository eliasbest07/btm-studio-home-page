"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"
import { useTranslations } from "next-intl"
import { 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  Code, 
  Database, 
  Globe, 
  Users, 
  Calendar, 
  Plus, 
  X, 
  Edit,
  Trash2,
  Send,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EstoyTrabajando() {
  const t = useTranslations() // hook de next-intl para traducciones
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set())
  const [showNewProposal, setShowNewProposal] = useState<number | null>(null)
  const [newProposalText, setNewProposalText] = useState("")
  const itemsPerPage = 6

  const mockProjects = [
    {
      id: 1,
      type: "E-commerce Platform",
      username: "Carlos Rodriguez",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      level: 3,
      technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      description: "Desarrollo de componentes reutilizables para la plataforma de e-commerce. Se requiere experiencia en React y manejo de estados complejos.",
      date: "2025-08-14",
      proposals: [
        {
          id: 1,
          body: "Hola! Tengo más de 5 años de experiencia desarrollando componentes React reutilizables. He trabajado en varios proyectos de e-commerce similares y puedo entregar componentes optimizados y bien documentados. Mi enfoque incluye testing automatizado y documentación completa.",
          date: "2025-08-14",
          username: "Ana García",
          userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face"
        },
        {
          id: 2,
          body: "Me especializo en arquitecturas escalables con React y TypeScript. Puedo crear un sistema de componentes completo con Storybook, pruebas unitarias y documentación técnica. He desarrollado librerías de componentes para empresas Fortune 500.",
          date: "2025-08-13",
          username: "Miguel Torres",
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
        }
      ]
    },
    {
      id: 2,
      type: "Analytics Dashboard",
      username: "Sofia Martinez",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      level: 5,
      technologies: ["Node.js", "Express", "MongoDB", "Socket.io"],
      description: "Dashboard analítico para visualización de datos en tiempo real con WebSockets y base de datos MongoDB.",
      date: "2025-08-13",
      proposals: [
        {
          id: 1,
          body: "Excelente proyecto! Tengo experiencia desarrollando dashboards en tiempo real con Node.js y Socket.io. Puedo implementar visualizaciones interactivas con D3.js y optimizar las consultas MongoDB para gran volumen de datos.",
          date: "2025-08-13",
          username: "David Chen",
          userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
        }
      ]
    },
    {
      id: 3,
      type: "SaaS Platform",
      username: "Roberto Silva",
      userAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      level: 4,
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      description: "Plataforma SaaS completa con autenticación, pagos integrados y dashboard de usuario. Se necesita experiencia en arquitecturas escalables.",
      date: "2025-08-12",
      proposals: [
        {
          id: 1,
          body: "He desarrollado múltiples plataformas SaaS desde cero. Puedo manejar toda la arquitectura, desde la autenticación JWT hasta la integración con Stripe. Mi experiencia incluye escalabilidad, seguridad y UX optimizada.",
          date: "2025-08-12",
          username: "Laura Gomez",
          userAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face"
        },
        {
          id: 2,
          body: "Especialista en MERN stack con 7+ años de experiencia. Puedo crear una plataforma robusta con microservicios, testing automatizado y CI/CD. He trabajado con empresas desde startups hasta corporaciones.",
          date: "2025-08-11",
          username: "Pedro Ramirez",
          userAvatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face"
        }
      ]
    }
  ]

  // Calcular paginación
  const totalPages = Math.ceil(mockProjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = mockProjects.slice(startIndex, endIndex)

  const toggleProposals = (projectId: number) => {
    const newExpanded = new Set(expandedProjects)
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId)
      setShowNewProposal(null)
    } else {
      newExpanded.add(projectId)
    }
    setExpandedProjects(newExpanded)
    setNewProposalText("")
  }

  const handleSubmitProposal = (projectId: number) => {
    if (!newProposalText.trim()) return

    // Aquí añadirías la lógica para enviar la propuesta a la base de datos
    console.log("Nueva propuesta para proyecto:", projectId, newProposalText)
    
    // Simular agregar la propuesta localmente
    setNewProposalText("")
    setShowNewProposal(null)
  }

  const getLevelColor = (level: number) => {
    const colors = {
      1: "bg-gray-100 text-gray-700",
      2: "bg-green-100 text-green-700",
      3: "bg-blue-100 text-blue-700",
      4: "bg-purple-100 text-purple-700",
      5: "bg-orange-100 text-orange-700"
    }
    return colors[level as keyof typeof colors] || colors[1]
  }

  const getTechIcon = (tech: string) => {
    const icons: { [key: string]: any } = {
      "React": Code,
      "Node.js": Database,
      "Next.js": Globe,
      "Vue.js": Code,
      "MongoDB": Database,
      "TypeScript": Code,
      "Express": Database
    }
    const IconComponent = icons[tech] || Code
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Estoy Trabajando
          </h1>
          <p className="text-slate-400 text-lg">
            Encuentra tu próximo proyecto ideal y envía tu propuesta
          </p>
        </div>

       
        

        {/* Projects List - Full Width */}
        <div className="space-y-6 mb-8">
          {currentProjects.map((project) => (
            <div
              key={project.id}
              className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Header */}
              <div className="bg-slate-800/90 backdrop-blur-sm p-6 border-b border-slate-700">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={project.userAvatar}
                        alt={project.username}
                        className="w-16 h-16 rounded-full border-2 border-slate-600"
                      />
                      <div>
                        <h3 className="text-2xl font-bold text-white">{project.username}</h3>
                        <p className="text-slate-300 text-lg">{project.type}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getLevelColor(project.level)}`}>
                          Nivel {project.level}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-slate-400 text-sm">Propuestas</p>
                        <p className="text-cyan-400 font-bold text-2xl">{project.proposals.length}</p>
                      </div>
                      <Button
                        onClick={() => toggleProposals(project.id)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Ver Propuestas
                        {expandedProjects.has(project.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-slate-300 mb-4 text-lg leading-relaxed">
                  {project.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {project.technologies.map((tech, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 rounded-lg">
                      {getTechIcon(tech)}
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{project.date}</span>
                  </div>
                </div>
              </div>

              {/* Proposals Section */}
              {expandedProjects.has(project.id) && (
                <div className="border-t border-slate-700 bg-slate-900/30">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white">Propuestas ({project.proposals.length})</h3>
                      <Button
                        onClick={() => setShowNewProposal(showNewProposal === project.id ? null : project.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Propuesta
                      </Button>
                    </div>

                    {/* New Proposal Form */}
                    {showNewProposal === project.id && (
                      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Enviar Nueva Propuesta</h4>
                        <textarea
                          value={newProposalText}
                          onChange={(e) => setNewProposalText(e.target.value)}
                          placeholder="Escribe tu propuesta aquí... Incluye tu experiencia, enfoque y por qué eres el candidato ideal para este proyecto."
                          className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-blue-500"
                        />
                        <div className="flex justify-end gap-3 mt-4">
                          <Button
                            onClick={() => setShowNewProposal(null)}
                            variant="outline"
                            className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => handleSubmitProposal(project.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Enviar Propuesta
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Proposals List */}
                    <div className="space-y-4">
                      {project.proposals.map((proposal) => (
                        <div
                          key={proposal.id}
                          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={proposal.userAvatar}
                              alt={proposal.username}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-white">{proposal.username}</h5>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600">
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="bg-red-900/50 border-red-700 text-red-400 hover:bg-red-900">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-slate-300 mb-3 leading-relaxed">{proposal.body}</p>
                              <div className="flex items-center gap-4 text-slate-400 text-sm">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{proposal.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <div className="text-slate-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, mockProjects.length)} de {mockProjects.length} proyectos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                  }
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 disabled:opacity-50"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}