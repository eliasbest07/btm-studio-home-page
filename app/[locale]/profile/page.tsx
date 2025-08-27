"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Lock, Unlock, Rocket, Sparkles, FolderOpen, HardDrive } from "lucide-react";
import Link from "next/link";

interface Project {
  id: number;
  nombre: string;
  description: string;
  publico: boolean;
  timestamp: string;
  imagen_url?: string;
  producto?: string;
}

interface LocalProject {
  id: string;
  name: string;
  path: string;
  lastModified: string;
  type: string;
}

export default function ProfilePage() {
  const [isPublic, setIsPublic] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [localProjects, setLocalProjects] = useState<LocalProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLocal, setLoadingLocal] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  const glassmorphismStyle = {
    background: "rgba(158, 158, 149, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow:
      "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        fetchProjects(session.user.id);
      } else {
        setLoading(false);
      }
    };

    getUser();
    fetchLocalProjects();
  }, []);

  const fetchProjects = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocalProjects = async () => {
    try {
      // Simular proyectos locales - en una implementación real, esto vendría de una API local o sistema de archivos
      const mockLocalProjects: LocalProject[] = [
        {
          id: "local-1",
          name: "Mi App React",
          path: "/Users/usuario/proyectos/mi-app-react",
          lastModified: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
          type: "React"
        },
        {
          id: "local-2",
          name: "API Node.js",
          path: "/Users/usuario/proyectos/api-nodejs",
          lastModified: new Date(Date.now() - 172800000).toISOString(), // 2 días atrás
          type: "Node.js"
        },
        {
          id: "local-3",
          name: "Landing Page",
          path: "/Users/usuario/proyectos/landing-page",
          lastModified: new Date(Date.now() - 259200000).toISOString(), // 3 días atrás
          type: "HTML/CSS"
        }
      ];

      // Simular delay de carga
      setTimeout(() => {
        setLocalProjects(mockLocalProjects);
        setLoadingLocal(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching local projects:', error);
      setLoadingLocal(false);
    }
  };

  const filteredProjects = projects.filter(project => project.publico === isPublic);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <div className="min-h-screen text-white px-3 py-4 sm:p-6 space-y-4 sm:space-y-8 overflow-x-hidden">
      {/* Header de Bienvenida */}
      <div
        className="p-4 sm:p-8 rounded-xl sm:rounded-2xl text-white relative overflow-hidden"
        style={glassmorphismStyle}
      >
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent break-words">
              Bienvenido, Jesus
            </h1>
          </div>
          <p className="text-gray-300 text-sm sm:text-lg">
            Gestiona y accede a todos tus proyectos desde aquí
          </p>
        </div>

        {/* Decorative elements - hidden on mobile */}
        <div className="absolute top-4 right-4 opacity-20 hidden sm:block">
          <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600"></div>
        </div>
        <div className="absolute bottom-4 right-16 opacity-10 hidden sm:block">
          <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-pink-400 to-orange-600"></div>
        </div>
      </div>

      {/* Switch Público/Privado */}
      <div
        className="p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between"
        style={glassmorphismStyle}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          {isPublic ? (
            <Unlock className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 flex-shrink-0" />
          ) : (
            <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0" />
          )}
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white">
              Proyectos {isPublic ? "Públicos" : "Privados"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              {isPublic
                ? "Visibles para todos los usuarios"
                : "Solo visibles para ti"
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <span className="text-xs sm:text-sm text-gray-300">Privado</span>
          <Switch
            checked={isPublic}
            onCheckedChange={setIsPublic}
            className="data-[state=checked]:bg-green-500"
          />
          <span className="text-xs sm:text-sm text-gray-300">Público</span>
        </div>
      </div>

      {/* Contenido Principal */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Tus Proyectos ({filteredProjects.length})
            </h2>
            <Button
              asChild
              className="text-white px-4 py-2 sm:px-6 sm:py-3 font-semibold rounded-xl hover:brightness-110 transition-all duration-200 w-full sm:w-auto text-sm sm:text-base"
              style={glassmorphismStyle}
            >
              <Link href="/plan">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Nuevo Proyecto
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 sm:p-6 rounded-xl text-white hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 group"
                style={glassmorphismStyle}
              >
                {project.imagen_url && (
                  <div className="mb-3 sm:mb-4 rounded-lg overflow-hidden">
                    <img
                      src={project.imagen_url}
                      alt={project.nombre}
                      className="w-full h-24 sm:h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-white line-clamp-2 min-w-0">
                      {project.nombre}
                    </h3>
                    {project.publico ? (
                      <Unlock className="h-4 w-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <Lock className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 pt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(project.timestamp).toLocaleDateString()}
                    </span>

                    <Button
                      asChild
                      size="sm"
                      className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg text-xs sm:text-sm w-full sm:w-auto"
                    >
                      <Link href={`/proyectos/${project.producto || project.id}`}>
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Ver Proyecto
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* CTA para primer proyecto */
        <div
          className="p-6 sm:p-12 rounded-xl sm:rounded-2xl text-center text-white relative overflow-hidden"
          style={glassmorphismStyle}
        >
          <div className="relative z-10 space-y-4 sm:space-y-6">
            <div className="flex justify-center">
              <div className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                <Rocket className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ¡Crea tu primer proyecto!
              </h2>
              <p className="text-gray-300 text-sm sm:text-lg max-w-md mx-auto px-2">
                {isPublic
                  ? "No tienes proyectos públicos aún. Haz público algún proyecto o crea uno nuevo."
                  : "Comienza tu viaje creativo. Diseña, planifica y da vida a tus ideas."
                }
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="text-white px-6 py-3 sm:px-8 sm:py-4 font-semibold rounded-xl hover:brightness-110 transition-all duration-200 text-base sm:text-lg w-full sm:w-auto"
                style={{
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
                }}
              >
                <Link href="/plan">
                  <Rocket className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  Crear mi primer proyecto 🚀
                </Link>
              </Button>

              {!isPublic && (
                <Button
                  onClick={() => setIsPublic(true)}
                  variant="outline"
                  size="lg"
                  className="text-white border-white/20 hover:bg-white/10 px-4 py-2 sm:px-6 sm:py-4 rounded-xl w-full sm:w-auto"
                >
                  Ver proyectos públicos
                </Button>
              )}
            </div>
          </div>

          {/* Decorative background - hidden on mobile */}
          <div className="absolute inset-0 opacity-10 hidden sm:block">
            <div className="absolute top-1/4 left-1/4 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse delay-1000"></div>
          </div>
        </div>
      )}

      {/* Sección de Proyectos Locales */}
      <div
        className="p-4 sm:p-6 rounded-xl text-white"
        style={glassmorphismStyle}
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <HardDrive className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Proyectos Locales
          </h2>
        </div>

        {loadingLocal ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          </div>
        ) : localProjects.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {localProjects.map((project) => (
              <div
                key={project.id}
                className="p-3 sm:p-4 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-white truncate">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">
                        {project.path}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-gray-300 bg-gray-700/50 px-2 py-1 rounded">
                        {project.type}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(project.lastModified).toLocaleDateString()}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="bg-orange-600/20 hover:bg-orange-600/40 text-orange-300 border border-orange-500/30 rounded-lg text-xs"
                    >
                      <FolderOpen className="h-3 w-3 mr-1" />
                      Abrir
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2 border-t border-white/10">
              <Button
                variant="outline"
                className="w-full text-black border-white/20 hover:bg-white/10 text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar proyecto local
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No se encontraron proyectos locales
            </p>
            <Button
              variant="outline"
              className="mt-3 text-white border-white/20 hover:bg-white/10 text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar proyecto local
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
