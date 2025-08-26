"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"
import { useTranslations } from "next-intl"
import { readUserData } from "@/app/utils/userSession"
import { useRouter, usePathname } from "next/navigation"
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
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loadingProposalId, setLoadingProposalId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const [showNewProposal, setShowNewProposal] = useState<string | null>(null)
  const [newProposalText, setNewProposalText] = useState("")
  const itemsPerPage = 6
  const [requestingNivelId, setRequestingNivelId] = useState<string | null>(null)
  const [creatingProposalId, setCreatingProposalId] = useState<string | null>(null)

  const handleNewProposal = (tareaId: string) => {
    const userData = readUserData()
    const isLoggedIn = localStorage.getItem("loggedIn") === "true"
    
    if (!userData || !isLoggedIn) {
      // Guardar la URL actual para redirigir después del login
      const currentUrl = encodeURIComponent(pathname)
      router.push(`/login?returnTo=${currentUrl}`)
      return
    }

    // Si está logueado, mostrar el formulario de propuesta
    setShowNewProposal(showNewProposal === tareaId ? null : tareaId)
  }

  const handleGoToTotalTime = async (tareaId: string) => {
    try {
      setCreatingProposalId(tareaId)
      
      // Obtener datos del usuario para el usuario_id
      const userData = readUserData()
      if (!userData) {
        alert("Error: No se pudo obtener la información del usuario")
        return
      }

      // Obtener el usuario_id desde Supabase basado en el correo
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuario')
        .select('id')
        .eq('correo', userData.correo)
        .single()

      if (usuarioError || !usuarioData) {
        alert("Error: No se pudo obtener el ID del usuario")
        console.error('Error obteniendo usuario:', usuarioError)
        return
      }

      // Llamar a la API para crear la propuesta
      const response = await fetch('/api/propuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tarea_id: tareaId,
          usuario_id: usuarioData.id
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la propuesta')
      }

      // Si todo sale bien, abrir Total-Time.app con el ID de la propuesta en nueva pestaña
      const propuestaUrl = `https://total-time.app/propuesta/${result.propuesta_id}`
      window.open(propuestaUrl, "_blank")
      
      // Cerrar el modal de propuesta
      setShowNewProposal(null)

    } catch (error) {
      console.error('Error creando propuesta:', error)
      alert('Error: ' + (error as Error).message)
    } finally {
      setCreatingProposalId(null)
    }
  }

  const handleSolicitarNivel = async (tareaId: string) => {
    try {
      setLoading(true);

      const res = await fetch("./api/check-level", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tareaId }),
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error en la solicitud");

      if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
        } else {
        alert("✅ Solicitud creada (sin URL de redirección)");
      }
  
      // éxito
      alert("✅ Solicitud creada con éxito")

      // al ser exitoso necesito que valla a la pagina 
    } catch (err) {
      console.error("Error inesperado en solicitar nivel:", err)
      alert("❌ Ocurrió un error inesperado. Revisa la consola.")
    } finally {
      setLoading(false);
    }
  }
  

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
      <div className="min-h-screen p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
              <span className="text-base sm:text-xl">Cargando proyectos...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            Ahora si puedes decir. Estoy Trabajando
          </h1>
        </div>

        {/* Stats */}


        {/* Projects List - Full Width */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          {currentTareas.map((tarea) => {
            const technologies = parseTechnologies(tarea.tecnologias)
            return (
              <div
                key={tarea.id}
                className="relative w-full bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* Botón Solicitar Nivel - Esquina superior derecha */}
                <div className="absolute top-0 right-0 z-10">
  <Button
    className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-none rounded-bl-lg rounded-tr-xl font-medium"
    onClick={() => handleSolicitarNivel(tarea.id)}
    disabled={requestingNivelId === tarea.id}
  >
    {requestingNivelId === tarea.id ? (
      <>
        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
        Solicitando...
      </>
    ) : (
      "SOLICITAR NIVEL"
    )}
  </Button>
</div>


                {/* Header con información del usuario */}
                <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-sm p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img
                      src={getAvatarUrl(tarea.usuario ?? null)}
                      alt={getUserName(tarea.usuario ?? null)}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-slate-600 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getAvatarUrl(tarea.usuario ?? null)
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">{getUserName(tarea.usuario ?? null)}</h3>
                      <h4 className="text-sm sm:text-base text-slate-300 mb-2">{tarea.nombre_producto}</h4>
                      <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getLevelColor(tarea.nivel)}`}>
                        Nivel {tarea.nivel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-4 sm:p-6 bg-slate-900/30">
                  <p className="text-slate-300 mb-4 text-sm sm:text-base leading-relaxed">
                    {tarea.descripcion}
                  </p>

                  {/* Footer con fecha y botón Ver Propuestas */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-400 text-xs sm:text-sm">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{formatDate(tarea.created_at)}</span>
                    </div>

                    {/* Botón Ver Propuestas en la esquina inferior derecha */}
                    <Button
                      onClick={() => toggleProposals(tarea.id)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      Ver Propuestas ({tarea.propuestas?.length || 0})
                      {expandedProjects.has(tarea.id) ? (
                        <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Proposals Section */}
                {expandedProjects.has(tarea.id) && (
                  <div className="border-t border-slate-700 bg-slate-900/30">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-bold text-white">Propuestas ({tarea.propuestas?.length || 0})</h3>
                        <Button
                          onClick={() => handleNewProposal(tarea.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base px-3 sm:px-4 py-2"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Nueva Propuesta
                        </Button>
                      </div>

                      {/* New Proposal Form */}
                      {showNewProposal === tarea.id && (
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700 mb-4 sm:mb-6">
                          <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Crear Nueva Propuesta</h4>
                          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 sm:p-6 mb-4">
                            <div className="text-center">
                              <div className="mb-4">
                                <Send className="w-12 h-12 mx-auto text-blue-400 mb-3" />
                              </div>
                              <h5 className="text-lg font-semibold text-white mb-2">Usa la herramienta de Total-Time</h5>
                              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Para crear propuestas profesionales y gestionar tus proyectos de manera eficiente, 
                                debes usar la herramienta especializada en Total-Time.app
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                            <Button
                              onClick={() => setShowNewProposal(null)}
                              variant="outline"
                              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 text-sm sm:text-base px-3 sm:px-4 py-2"
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={() => handleGoToTotalTime(tarea.id)}
                              disabled={creatingProposalId === tarea.id}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-3 sm:px-4 py-2 disabled:opacity-50"
                            >
                              {creatingProposalId === tarea.id ? (
                                <>
                                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                                  Creando...
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                  Ir a Total-time
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Proposals List */}
                      <div className="space-y-3 sm:space-y-4">
                        {tarea.propuestas?.map((propuesta) => (
                          <div
                            key={propuesta.id}
                            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-700"
                          >
                            <div className="flex items-start gap-3 sm:gap-4">
                              <img
                                src={getAvatarUrl(propuesta.usuario ?? null)}
                                alt={getUserName(propuesta.usuario ?? null)}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = getAvatarUrl(propuesta.usuario ?? null)
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                  <h5 className="font-semibold text-white text-sm sm:text-base truncate">{getUserName(propuesta.usuario ?? null)}</h5>
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 p-1 sm:p-2"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeleteProposal(propuesta.id, tarea.id)}
                                      className="bg-red-900/50 border-red-700 text-red-400 hover:bg-red-900 p-1 sm:p-2"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-slate-300 mb-3 leading-relaxed text-sm sm:text-base">{propuesta.cuerpo}</p>
                                <div className="flex items-center gap-4 text-slate-400 text-xs sm:text-sm">
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
                          <div className="text-center py-6 sm:py-8 text-slate-400">
                            <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                            <p className="text-sm sm:text-base">No hay propuestas para esta tarea aún.</p>
                            <p className="text-sm sm:text-base">¡Sé el primero en enviar una propuesta!</p>
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
          <div className="text-center py-12 sm:py-16 text-slate-400">
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No hay proyectos disponibles</h3>
            <p className="text-sm sm:text-base">No se encontraron proyectos en la base de datos.</p>
          </div>
        )}

        {/* Paginación */}
        {tareas.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-slate-700">
            <div className="text-slate-400 text-xs sm:text-sm text-center sm:text-left">
              Mostrando {startIndex + 1}-{Math.min(endIndex, tareas.length)} de {tareas.length} proyectos
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 disabled:opacity-50 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline ml-1">Anterior</span>
              </Button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`flex-shrink-0 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ${currentPage === page
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                      }`}
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
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 disabled:opacity-50 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline mr-1">Siguiente</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}