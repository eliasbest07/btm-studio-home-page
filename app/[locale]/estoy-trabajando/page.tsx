"use client"

import { useState, useEffect } from "react"
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
  ChevronUp,
  Loader2
} from "lucide-react"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


interface Usuario {
  id: number
  created_at?: string
  nombre?: string | null
  avatar?: string | null
  id_usuario?: string | null
  correo?: string | null
}

interface Propuesta {
  id: string
  tarea_id: string
  usuario_id: number
  cuerpo: string
  fecha: string
  usuario?: Usuario | null
}

interface Tarea {
  id: string
  usuario_id: number
  tipo_tarea: string
  nivel: string
  tecnologias: string
  descripcion: string
  created_at: string
  nombre_producto: string
  usuario?: Usuario | null
  propuestas?: Propuesta[]
}


export default function EstoyTrabajando() {
  const t = useTranslations() // hook de next-intl para traducciones
  const [loading, setLoading] = useState(true)
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loadingProposalId, setLoadingProposalId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const [showNewProposal, setShowNewProposal] = useState<string | null>(null)
  const [newProposalText, setNewProposalText] = useState("")
  const itemsPerPage = 6

  // Cargar tareas y propuestas desde Supabase
  useEffect(() => {
    loadTareasAndPropuestas()
  }, [])

  const loadTareasAndPropuestas = async () => {
  try {
    setLoading(true);

    const { data, error } = await supabase
      .from('tareas_delegadas')
      .select(`
        id,
        usuario_id,
        tipo_tarea,
        nivel,
        tecnologias,
        descripcion,
        created_at,
        nombre_producto,
        usuario:usuario ( id, nombre, avatar, id_usuario, correo ),
        propuestas:propuestas (
          id, tarea_id, usuario_id, cuerpo, fecha,
          usuario:usuario ( id, nombre, avatar, id_usuario, correo )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error cargando tareas:', error);
      console.error('Error cargando tareas:', error);
      return;
    }

    // Normalizar data: convertir arrays de 1 elemento en objeto
    const normalized: Tarea[] = (data ?? []).map((t: any) => {
      const usuarioRaw = t.usuario;
      const usuario = Array.isArray(usuarioRaw) ? (usuarioRaw[0] ?? null) : (usuarioRaw ?? null);

      const propuestasRaw = t.propuestas ?? [];
      const propuestas: Propuesta[] = (propuestasRaw as any[]).map((p: any) => {
        const pUsuarioRaw = p.usuario;
        const pUsuario = Array.isArray(pUsuarioRaw) ? (pUsuarioRaw[0] ?? null) : (pUsuarioRaw ?? null);
        return {
          id: p.id,
          tarea_id: p.tarea_id,
          usuario_id: p.usuario_id,
          cuerpo: p.cuerpo,
          fecha: p.fecha,
          usuario: pUsuario,
        };
      });

      return {
        id: t.id,
        usuario_id: t.usuario_id,
        tipo_tarea: t.tipo_tarea,
        nivel: t.nivel,
        tecnologias: t.tecnologias,
        descripcion: t.descripcion,
        created_at: t.created_at,
        nombre_producto: t.nombre_producto,
        usuario,
        propuestas,
      } as Tarea;
    });

    setTareas(normalized);
  } catch (err) {
    console.error('Error general:', err);
  } finally {
    setLoading(false);
  }
};


  // Calcular paginación
  const totalPages = Math.ceil(tareas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTareas = tareas.slice(startIndex, endIndex)

  const toggleProposals = (tareaId: string) => {
    const newExpanded = new Set(expandedProjects)
    if (newExpanded.has(tareaId)) {
      newExpanded.delete(tareaId)
      setShowNewProposal(null)
    } else {
      newExpanded.add(tareaId)
    }
    setExpandedProjects(newExpanded)
    setNewProposalText("")
  }

  const handleSubmitProposal = async (tareaId: string) => {
    if (!newProposalText.trim()) return

    try {
      setLoadingProposalId(tareaId)

      const { data, error } = await supabase
        .from('propuestas')
        .insert([
          {
            tarea_id: tareaId,
            usuario_id: 1, // Aquí deberías usar el ID del usuario actual
            cuerpo: newProposalText,
            fecha: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Error enviando propuesta:', error)
        return
      }

      // Actualizar las tareas localmente agregando la nueva propuesta
      setTareas(prevTareas => 
        prevTareas.map(tarea => 
          tarea.id === tareaId 
            ? { 
                ...tarea, 
                propuestas: [data[0], ...(tarea.propuestas || [])]
              }
            : tarea
        )
      )

      setNewProposalText("")
      setShowNewProposal(null)
    } catch (error) {
      console.error('Error inesperado:', error)
    } finally {
      setLoadingProposalId(null)
    }
  }

  const handleDeleteProposal = async (propuestaId: string, tareaId: string) => {
    try {
      const { error } = await supabase
        .from('propuestas')
        .delete()
        .eq('id', propuestaId)

      if (error) {
        console.error('Error eliminando propuesta:', error)
        return
      }

      // Actualizar las tareas localmente removiendo la propuesta
      setTareas(prevTareas => 
        prevTareas.map(tarea => 
          tarea.id === tareaId 
            ? { 
                ...tarea, 
                propuestas: (tarea.propuestas || []).filter(p => p.id !== propuestaId)
              }
            : tarea
        )
      )
    } catch (error) {
      console.error('Error inesperado:', error)
    }
  }

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      "1": "bg-gray-100 text-gray-700",
      "2": "bg-green-100 text-green-700",
      "3": "bg-blue-100 text-blue-700",
      "4": "bg-purple-100 text-purple-700",
      "5": "bg-orange-100 text-orange-700",
      "Básico": "bg-gray-100 text-gray-700",
      "Intermedio": "bg-blue-100 text-blue-700",
      "Avanzado": "bg-purple-100 text-purple-700",
      "Experto": "bg-orange-100 text-orange-700"
    }
    return colors[level] || colors["1"]
  }

  const getTechIcon = (tech: string) => {
    const icons: { [key: string]: any } = {
      "React": Code,
      "Node.js": Database,
      "Next.js": Globe,
      "Vue.js": Code,
      "MongoDB": Database,
      "TypeScript": Code,
      "Express": Database,
      "JavaScript": Code,
      "Python": Code,
      "PHP": Code
    }
    const IconComponent = icons[tech] || Code
    return <IconComponent className="w-4 h-4" />
  }

  const parseTechnologies = (techString: string): string[] => {
  // Verificar si techString existe y es una cadena
  if (!techString || typeof techString !== 'string') return []
  
  try {
    // Si es un JSON array
    return JSON.parse(techString)
  } catch {
    // Si es una cadena separada por comas
    return techString.split(',').map(t => t.trim()).filter(t => t)
  }
}

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getAvatarUrl = (usuario: Usuario | null) => {
    if (usuario?.avatar) {
      return usuario.avatar;
    }
    // Fallback to generated avatar if no avatar in database
    const name = usuario?.nombre || `Usuario ${usuario?.id || 'Desconocido'}`;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=334155&color=ffffff&size=64`;
  }

  const getUserName = (usuario: Usuario | null) => {
    return usuario?.nombre || `Usuario ${usuario?.id || 'Desconocido'}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-white">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xl">Cargando proyectos...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Ahora si puedes decir. Estoy Trabajando
          </h1>
        </div>

        {/* Stats */}
        

        {/* Projects List - Full Width */}
        <div className="space-y-6 mb-8">
          {currentTareas.map((tarea) => {
            const technologies = parseTechnologies(tarea.tecnologias)
            return (
              <div
                key={tarea.id}
                className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* Header */}
                <div className="bg-slate-800/90 backdrop-blur-sm p-6 border-b border-slate-700">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={getAvatarUrl(tarea.usuario ?? null)}
                          alt={getUserName(tarea.usuario ?? null)}
                          className="w-16 h-16 rounded-full border-2 border-slate-600"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getAvatarUrl(tarea.usuario ?? null)
                          }}
                        />
                        <div>
                          <h3 className="text-2xl font-bold text-white">{getUserName(tarea.usuario ?? null)}</h3>
                          <h4 className="text-xl font-semibold text-white mb-2">{tarea.nombre_producto}</h4>
                          {/* <p className="text-slate-300 text-lg">{tarea.tipo_tarea}</p> */}

                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getLevelColor(tarea.nivel)}`}>
                            Nivel {tarea.nivel}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-slate-400 text-sm">Propuestas</p>
                          <p className="text-cyan-400 font-bold text-2xl">{tarea.propuestas?.length || 0}</p>
                        </div>
                        <Button
                          onClick={() => toggleProposals(tarea.id)}
                          className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Ver Propuestas
                          {expandedProjects.has(tarea.id) ? (
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
                    {tarea.descripcion}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {technologies.map((tech, index) => (
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
                      <span>{formatDate(tarea.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Proposals Section */}
                {expandedProjects.has(tarea.id) && (
                  <div className="border-t border-slate-700 bg-slate-900/30">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Propuestas ({tarea.propuestas?.length || 0})</h3>
                        <Button
                          onClick={() => setShowNewProposal(showNewProposal === tarea.id ? null : tarea.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Nueva Propuesta
                        </Button>
                      </div>

                      {/* New Proposal Form */}
                      {showNewProposal === tarea.id && (
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
                              onClick={() => handleSubmitProposal(tarea.id)}
                              disabled={loadingProposalId === tarea.id}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {loadingProposalId === tarea.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Enviando...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Enviar Propuesta
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Proposals List */}
                      <div className="space-y-4">
                        {tarea.propuestas?.map((propuesta) => (
                          <div
                            key={propuesta.id}
                            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
                          >
                            <div className="flex items-start gap-4">
                              <img
                                src={getAvatarUrl(propuesta.usuario ?? null)}
                                alt={getUserName(propuesta.usuario ?? null)}
                                className="w-12 h-12 rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = getAvatarUrl(propuesta.usuario ?? null)
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-semibold text-white">{getUserName(propuesta.usuario ?? null)}</h5>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => handleDeleteProposal(propuesta.id, tarea.id)}
                                      className="bg-red-900/50 border-red-700 text-red-400 hover:bg-red-900"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-slate-300 mb-3 leading-relaxed">{propuesta.cuerpo}</p>
                                <div className="flex items-center gap-4 text-slate-400 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(propuesta.fecha)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {(!tarea.propuestas || tarea.propuestas.length === 0) && (
                          <div className="text-center py-8 text-slate-400">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No hay propuestas para esta tarea aún.</p>
                            <p>¡Sé el primero en enviar una propuesta!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {tareas.length === 0 && !loading && (
          <div className="text-center py-16 text-slate-400">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No hay proyectos disponibles</h3>
            <p>No se encontraron proyectos en la base de datos.</p>
          </div>
        )}

        {/* Paginación */}
        {tareas.length > 0 && (
          <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400">
              Mostrando {startIndex + 1}-{Math.min(endIndex, tareas.length)} de {tareas.length} proyectos
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
        )}
      </div>
    </div>
  )
}