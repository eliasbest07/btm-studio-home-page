"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Lock, Unlock, Loader2, Save, X, Plus, Trash2, PlayIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import ProductCheckModal from "@/app/components/showInputProducto";

const supabaseClient = createClientComponentClient();

const projectTypes : string[] = ['Lista de tareas', 'Sitio web', 'Landing Page', 'Aplicación para móviles', 'Automatizacion'];

type ProjectContext = {
  description: string;
  stylePrompt: string;
  type: string;
  utility: string;
  palette: string;
  colors: string[] | null;
};

type Plan = {
  projectId?: string;
  tasks: string[];
  projectContext: ProjectContext;
  finalImageUrl: string | null;
  timestamp: string;
};

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js app router sometimes passes params as Promise
  const { id } = React.use(params);
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isPublic, setIsPublic] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Editing state from code2
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedPlan, setEditedPlan] = React.useState<Plan | null>(null);
  const [newTask, setNewTask] = React.useState("");

  // Product modal / privacy flow from code1
  const [productModalOpen, setProductModalOpen] = React.useState(false);
  
  // Supabase integration states
  const [isFromSupabase, setIsFromSupabase] = React.useState(false);
  const [supabaseProject, setSupabaseProject] = React.useState<any>(null);
  const [isFromCache, setIsFromCache] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isUserLoading, setIsUserLoading] = React.useState(true);
  
  // Estado para controlar qué tarea tiene los botones de acción expandidos
  const [expandedTaskIndex, setExpandedTaskIndex] = React.useState<number | null>(null);
  
  // Estados para el modal de delegación
  const [delegateModalOpen, setDelegateModalOpen] = React.useState(false);
  const [selectedTaskForDelegate, setSelectedTaskForDelegate] = React.useState<string>("");
  const [delegateForm, setDelegateForm] = React.useState({
    technologies: "",
    level: ""
  });
  
  const router = useRouter();
  const visibilityKey = `project-${id}-visibility`;

  // Safe localStorage helpers
  const safeLocalGet = (key: string) => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  };
  const safeLocalSet = (key: string, value: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  };

  // Verificar usuario logueado al cargar el componente
  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        setCurrentUser(session?.user || null);
      } catch (error) {
        console.error("Error checking user session:", error);
        setCurrentUser(null);
      } finally {
        setIsUserLoading(false);
      }
    };

    checkUser();
  }, []);

  // On mount: read visibility
  React.useEffect(() => {
    if (!isFromSupabase) {
      const stored = safeLocalGet(visibilityKey);
      if (stored !== null) {
        setIsPublic(stored === "public");
      }
    }
  }, [id, isFromSupabase]);

  // Función para buscar proyecto en Supabase (con cache)
  const fetchProjectFromSupabase = async (identifier: string) => {
    try {
      // 1. Primero verificar cache en sessionStorage
      const cacheKey = `supabase-project-${identifier}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      
      if (cachedData) {
        console.log('Usando datos cacheados para:', identifier);
        const parsedData = JSON.parse(cachedData);
        // Marcar que viene de cache
        parsedData._fromCache = true;
        // Limpiar cache después de usarlo para evitar datos obsoletos
        sessionStorage.removeItem(cacheKey);
        return parsedData;
      }

      // 2. Si no hay cache, hacer petición a Supabase
      const numericId = parseInt(identifier, 10);
      const isNumericId = !isNaN(numericId) && numericId.toString() === identifier;
      
      let query = supabaseClient
        .from('proyectos')
        .select(`
          *,
          tareas (*)
        `);

      if (isNumericId) {
        query = query.eq('id', numericId);
      } else {
        query = query.eq('producto', identifier);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error('Error fetching project from Supabase:', error);
        return null;
      }

      console.log('Datos obtenidos de Supabase para:', identifier);
      return data;
    } catch (e) {
      console.error('Error in fetchProjectFromSupabase:', e);
      return null;
    }
  };

  // Función para verificar si el usuario puede ver el proyecto
  const canUserViewProject = async (project: any) => {
    // Si es público, cualquiera puede verlo
    if (project.publico === true) {
      return true;
    }

    // Si es privado, verificar si el usuario es el propietario
    if (project.publico === false) {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session && session.user && session.user.id === project.user_id) {
        return true;
      }
      return false;
    }

    // Si publico es null/undefined, asumir que es público
    return true;
  };

  // Load plan from allProjectPlans or Supabase
  React.useEffect(() => {
    const loadProject = async () => {
      try {
        // 1. Primero buscar en localStorage (comportamiento original)
        const raw = safeLocalGet("allProjectPlans");
        const plans: Plan[] = raw ? JSON.parse(raw) : [];

        const n = Number(id);
        let chosen: Plan | null = Number.isFinite(n) ? plans[n - 1] ?? null : null;

        if (!chosen) {
          chosen = plans.find((p) => p.projectId === id) ?? null;
        }

        if (chosen) {
          // Encontrado en localStorage
          setPlan(chosen);
          setIsFromSupabase(false);
          setLoading(false);
          return;
        }

        // 2. Si no se encuentra en localStorage, buscar en Supabase
        const supabaseProject = await fetchProjectFromSupabase(id);
        
        if (supabaseProject) {
          // Verificar si el usuario puede ver este proyecto
          const canView = await canUserViewProject(supabaseProject);
          
          if (!canView) {
            setPlan(null);
            setLoading(false);
            return;
          }

          // Convertir el proyecto de Supabase al formato Plan
          const convertedPlan: Plan = {
            projectId: supabaseProject.id?.toString(),
            tasks: (supabaseProject.tareas || []).map((tarea: any) => tarea.descripcion),
            projectContext: {
              description: supabaseProject.description || supabaseProject.nombre || '',
              stylePrompt: supabaseProject.style_prompt || '',
              type: supabaseProject.type || '',
              utility: supabaseProject.utility || '',
              palette: supabaseProject.palette || '',
              colors: supabaseProject.colors || null
            },
            finalImageUrl: supabaseProject.imagen_url || null,
            timestamp: supabaseProject.timestamp || new Date().toISOString()
          };

          setPlan(convertedPlan);
          setSupabaseProject(supabaseProject);
          setIsFromSupabase(true);
          setIsFromCache(supabaseProject._fromCache || false);
          setIsPublic(supabaseProject.publico === true);
        } else {
          setPlan(null);
        }
      } catch (e) {
        console.error("Error loading project:", e);
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  // KEEP the privacy flow from code1 (accept product, open modal, send product + publico)
  const goPrivate = async (producto?: string) => {
    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {

        setIsLoading(false);
        
        // Guardar la URL actual para redirigir después del login
        const currentUrl = window.location.pathname;
        const loginUrl = `/login?returnTo=${encodeURIComponent(currentUrl)}`;
        router.push(loginUrl);
        return;
      }

      // Get plans from localStorage
      const raw = safeLocalGet("allProjectPlans");
      const plans: Plan[] = raw ? JSON.parse(raw) : [];

      const n = Number(id);
      let chosen: Plan | null = Number.isFinite(n)
        ? plans[n - 1] ?? null
        : null;

      if (!chosen) {
        chosen = plans.find((p) => p.projectId === id) ?? null;
      }

      if (!chosen || !chosen.projectContext) {
        alert("No se encontró el plan para guardar.");
        setIsLoading(false);
        return;
      }

      const newState = !isPublic;

      // POST including producto and publico (same as code1)
      const response = await fetch("../api/create-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...chosen,
          producto: producto,
          publico: newState,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al guardar la visibilidad.");
        setIsLoading(false);
        return;
      }

      setIsPublic(newState);
      safeLocalSet(visibilityKey, newState ? "public" : "private");
      
      // Si se creó exitosamente y tiene producto, redirigir y cachear datos
      if (data.projectId && producto) {
        // Crear objeto completo del proyecto para cache
        const fullProjectData = {
          id: data.projectId,
          user_id: session.user.id,
          nombre: chosen.projectContext.description,
          description: chosen.projectContext.description,
          style_prompt: chosen.projectContext.stylePrompt,
          type: chosen.projectContext.type,
          utility: chosen.projectContext.utility,
          palette: chosen.projectContext.palette,
          colors: chosen.projectContext.colors,
          imagen_url: chosen.finalImageUrl,
          timestamp: chosen.timestamp,
          publico: newState,
          producto: producto,
          tareas: chosen.tasks.map((taskDesc: string, index: number) => ({
            id: `temp-${index}`,
            descripcion: taskDesc,
            proyecto_id: data.projectId,
            estado: "pendiente"
          }))
        };

        // Cachear los datos del proyecto
        const cacheKey = `supabase-project-${producto}`;
        sessionStorage.setItem(cacheKey, JSON.stringify(fullProjectData));
        
        // Redirigir a la nueva URL con el producto
        router.push(`/proyectos/${producto}`);
        return;
      }
    } catch (error) {
      alert(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar cambio de privacidad
  async function togglePrivacy() {
    if (isFromSupabase && supabaseProject) {
      // Si es proyecto de Supabase, usar el endpoint de toggle
      await toggleSupabaseProjectPrivacy();
    } else {
      // Si es proyecto de localStorage, verificar usuario antes de abrir modal
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (!session) {
          // Guardar la URL actual para redirigir después del login
          const currentUrl = window.location.pathname;
          const loginUrl = `/login?returnTo=${encodeURIComponent(currentUrl)}`;
          router.push(loginUrl);
          return;
        }
        
        // Si hay usuario logueado, abrir modal para crear en Supabase
        setProductModalOpen(true);
      } catch (error) {
        console.error("Error checking user session:", error);
        // En caso de error, redirigir al login por seguridad
        const currentUrl = window.location.pathname;
        const loginUrl = `/login?returnTo=${encodeURIComponent(currentUrl)}`;
        router.push(loginUrl);
      }
    }
  }

  // Nueva función para cambiar privacidad de proyectos existentes en Supabase
  const toggleSupabaseProjectPrivacy = async () => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!session) {
        alert("Debes iniciar sesión para cambiar la visibilidad del proyecto.");
        setIsLoading(false);
        
        // Guardar la URL actual para redirigir después del login
        const currentUrl = window.location.pathname;
        const loginUrl = `/login?returnTo=${encodeURIComponent(currentUrl)}`;
        router.push(loginUrl);
        return;
      }

      // Verificar que el usuario es el propietario
      if (session.user.id !== supabaseProject.user_id) {
        alert("No tienes permisos para modificar este proyecto.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/proyectos/${supabaseProject.id}/toggle-privacy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al cambiar la visibilidad del proyecto.");
        setIsLoading(false);
        return;
      }

      // Actualizar el estado local
      setIsPublic(data.newStatus);
      setSupabaseProject((prev: any) => ({ ...prev, publico: data.newStatus }));
      
    } catch (error) {
      console.error("Error toggling privacy:", error);
      alert("Error al cambiar la visibilidad del proyecto.");
    } finally {
      setIsLoading(false);
    }
  };

  // Called when ProductCheckModal saves the chosen producto
  const handleProductSave = async (producto: string) => {
    setProductModalOpen(false);
    await goPrivate(producto);
  };

  // Funciones para el modal de delegación
  const openDelegateModal = (task: string) => {
    setSelectedTaskForDelegate(task);
    setDelegateModalOpen(true);
  };

  const closeDelegateModal = () => {
    setDelegateModalOpen(false);
    setSelectedTaskForDelegate("");
    setDelegateForm({
      technologies: "",
      level: ""
    });
  };

  const handleDelegateSubmit = async () => {
    // TODO: Implementar la lógica de delegación
    console.log("Delegando tarea:", {
      task: selectedTaskForDelegate,
      technologies: delegateForm.technologies,
      level: delegateForm.level
    });
    
    // Aquí iría la llamada a la API para delegar la tarea
    alert(`Tarea "${selectedTaskForDelegate}" delegada con éxito`);
    closeDelegateModal();
  };

  // ---------------- Editing functions (from code2) ----------------
  const startEditing = () => {
    setEditedPlan(plan ? JSON.parse(JSON.stringify(plan)) : null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedPlan(null);
    setIsEditing(false);
  };

  const saveChanges = () => {
    if (!editedPlan) return;

    try {
      const raw = safeLocalGet("allProjectPlans");
      const plans: Plan[] = raw ? JSON.parse(raw) : [];

      const n = Number(id);
      let index = Number.isFinite(n) ? n - 1 : plans.findIndex((p) => p.projectId === id);

      // If index invalid, try to find index by projectId
      if (!(index >= 0 && index < plans.length)) {
        index = plans.findIndex((p) => p.projectId === id);
      }

      if (index >= 0 && index < plans.length) {
        plans[index] = { ...editedPlan, timestamp: new Date().toISOString() };
        safeLocalSet("allProjectPlans", JSON.stringify(plans));
      } else {
        // If not found in array, push it (fallback)
        plans.push({ ...editedPlan, timestamp: new Date().toISOString() });
        safeLocalSet("allProjectPlans", JSON.stringify(plans));
      }

      setPlan(editedPlan);
      cancelEditing();
    } catch (error) {
      console.error("Error guardando cambios:", error);
      alert("Error al guardar los cambios");
    }
  };

  const updateEditedPlan = (field: string, value: any) => {
    if (!editedPlan) return;
    setEditedPlan((prev) => {
      if (!prev) return prev;
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: {
            ...(prev as any)[parent],
            [child]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const arrayUpdater = (
    key: keyof Plan | "projectContext.colors",
    index: number,
    value?: any,
    remove?: boolean
  ) => {
    if (!editedPlan) return;
    setEditedPlan((prev) => {
      if (!prev) return prev;
      let updated = { ...prev };
      if (key === "tasks") {
        const arr = [...prev.tasks];
        if (remove) arr.splice(index, 1);
        else arr[index] = value;
        updated.tasks = arr;
      }
      if (key === "projectContext.colors") {
        const arr = [...(prev.projectContext.colors || [])];
        if (remove) arr.splice(index, 1);
        else arr[index] = value;
        updated.projectContext = { ...prev.projectContext, colors: arr.length ? arr : null };
      }
      return updated;
    });
  };
  // ---------------- end editing functions ----------------

  // Función para determinar si se debe mostrar el botón de privacidad
  const shouldShowPrivacyButton = React.useMemo(() => {
    // Si aún está cargando el usuario, no mostrar el botón
    if (isUserLoading) return false;

    // Si es proyecto local (localStorage), siempre mostrar el botón
    if (!isFromSupabase) return true;

    // Si es proyecto de Supabase, solo mostrar si:
    // 1. Hay usuario logueado Y
    // 2. El usuario es propietario del proyecto
    if (isFromSupabase && supabaseProject) {
      return currentUser && currentUser.id === supabaseProject.user_id;
    }

    return false;
  }, [isUserLoading, isFromSupabase, currentUser, supabaseProject]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-100">
        Loading…
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-white px-4">
        <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
        <p className="mb-6">
          No hay un plan con id <span className="font-mono">{id}</span> en este navegador.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/plan">Crear un nuevo plan</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentPlan = isEditing ? editedPlan : plan;

  return (
    <div className="min-h-screen text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8">
          {/* Contenedor flex para alinear botones */}



          <div className="flex justify-between items-start mb-6">
            {/* Botón Volver */}
            <Button
              asChild
              className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(158,158,149,0.7)] hover:brightness-110 transition-all duration-200"
              style={{
                background: "rgba(158, 158, 149, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow:
                  "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                borderRadius: "20px",
              }}
            >
              <Link href="/">⬅ Volver al Inicio</Link>
            </Button>
          </div>

          {/* Botón de visibilidad: mostrar solo si cumple condiciones */}
   {shouldShowPrivacyButton && (
  <div className="flex flex-col md:flex-row items-center justify-between bg-blue-900/30 border border-blue-600/30  backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6 gap-4">
    <div className="md:mb-0">
      <p className="text-sm  text-blue-200 text-center md:text-left">
        {!isPublic
          ? "Para delegar tareas del proyecto debes convertirlo en privado"
          : "Puedes volver el proyecto público para que todos observen el desarrollo"}
      </p>
    </div>
    <div className="flex justify-center md:justify-end">
      <Button
        className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(198,198,199,1)] hover:brightness-110 transition-all duration-200"
        style={{
          background: "rgba(158, 158, 149, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow:
            "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          borderRadius: "20px",
        }}
        onClick={togglePrivacy}
        variant="outline"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : isPublic ? (
          <Unlock className="h-4 w-4 mr-2" />
        ) : (
          <Lock className="h-4 w-4 mr-2" />
        )}
        {isLoading
          ? "Cambiando..."
          : isFromSupabase
          ? isPublic
            ? "Hacer Privado"
            : "Hacer Público"
          : isPublic
          ? "Hacer Privado"
          : "Pasar a Producción Privado"}
      </Button>
    </div>
  </div>
)}

          {/* Título y descripción (editable) */}
          <div className="space-y-2">
            {isEditing ? (
              <input
                type="text"
                value={currentPlan?.projectContext.description || ""}
                onChange={(e) =>
                  updateEditedPlan("projectContext.description", e.target.value)
                }
                className="text-3xl sm:text-4xl font-bold text-gray-50 bg-transparent border border-gray-600 focus:border-gray-400 rounded-lg px-3 py-2 w-full outline-none transition-colors"
                placeholder="Descripción del proyecto"
              />
            ) : (
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-50">
                {plan.projectContext.description || "Proyecto sin título"}
              </h1>
            )}

            <p className="text-sm text-gray-400">
              {isFromSupabase ? `Proyecto: ${id}` : `Índice local: ${id}`}
              {isFromSupabase && supabaseProject?.producto && (
                <span className="ml-2 text-green-400">• {supabaseProject.producto}</span>
              )}
              {isFromCache && (
                <span className="ml-2 text-blue-400">• Cargado desde cache</span>
              )}
            </p>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={saveChanges}
                    className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-green-600/70 bg-green-600/50 border border-green-500/30"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button
                    onClick={cancelEditing}
                    variant="outline"
                    className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-red-600/70 bg-red-600/50 border border-red-500/30"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={startEditing}
                  variant="outline"
                  className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(158,158,149,0.7)] hover:brightness-110 transition-all duration-200"
                  style={{
                    background: "rgba(158, 158, 149, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow:
                      "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    borderRadius: "20px",
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </header>

        <main>
          {/* Contexto del proyecto (editable) */}
          <section className="p-6 rounded-lg border border-white/10 bg-black/20 space-y-6">
            <h2 className="text-2xl font-semibold">Contexto del Proyecto</h2>

            {/* Estilo */}
            <div>
              <label className="block text-sm font-medium mb-2">Estilo:</label>
              {isEditing ? (
                <textarea
                  value={currentPlan?.projectContext.stylePrompt || ""}
                  onChange={(e) =>
                    updateEditedPlan("projectContext.stylePrompt", e.target.value)
                  }
                  className="w-full bg-black/30 border border-gray-600 focus:border-gray-400 rounded-lg px-3 py-2 text-white outline-none transition-colors resize-y"
                  rows={3}
                />
              ) : (
                <p className="text-gray-200">{plan.projectContext.stylePrompt}</p>
              )}
            </div>

            {/* Tipo */}
<div>
  <label className="block text-sm font-medium text-gray-200 mb-2">
    Tipo:
  </label>
  {isEditing ? (
    <div className="flex flex-wrap gap-3">
      {projectTypes.map((type) => (
        <div
          key={type}
          onClick={() => updateEditedPlan("projectContext.type", type)}
          className={`cursor-pointer px-4 py-2 rounded-full border text-sm ${
            currentPlan?.projectContext.type === type
              ? "bg-white text-gray-900 border-white"
              : "bg-white/5 text-gray-200 border-white/20 hover:bg-white/10"
          } transition-colors duration-150`}
        >
          {type}
        </div>
      ))}
    </div>
  ) : (
    <span className="inline-block bg-blue-600/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm">
      {plan.projectContext.type}
    </span>
  )}
</div>

            {/* Utilidad */}
            <div>
              <label className="block text-sm font-medium mb-2">Utilidad:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={currentPlan?.projectContext.utility || ""}
                  onChange={(e) =>
                    updateEditedPlan("projectContext.utility", e.target.value)
                  }
                  className="w-full bg-black/30 border border-gray-600 focus:border-gray-400 rounded-lg px-3 py-2 text-white outline-none transition-colors"
                />
              ) : (
                <p className="text-gray-200">{plan.projectContext.utility}</p>
              )}
            </div>

            {/* Paleta */}
            <div>
              <label className="block text-sm font-medium mb-2">Paleta:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={currentPlan?.projectContext.palette || ""}
                  onChange={(e) =>
                    updateEditedPlan("projectContext.palette", e.target.value)
                  }
                  className="w-full bg-black/30 border border-gray-600 focus:border-gray-400 rounded-lg px-3 py-2 text-white outline-none transition-colors"
                />
              ) : (
                <p className="text-gray-200">{plan.projectContext.palette}</p>
              )}
            </div>

            {/* Colores */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Colores:</label>
                {isEditing && (
                  <Button
                    onClick={() =>
                      setEditedPlan((prev) =>
                        prev
                          ? {
                              ...prev,
                              projectContext: {
                                ...prev.projectContext,
                                colors: [
                                  ...(prev.projectContext.colors || []),
                                  "#3B82F6",
                                ],
                              },
                            }
                          : prev
                      )
                    }
                     style={{
                background: "rgba(158, 158, 149, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow:
                  "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                borderRadius: "20px",
              }}

                    size="sm"
                    variant="outline"
                    className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(198,198,199,1)] hover:brightness-110 transition-all duration-200"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Añadir Color
                  </Button>
                )}
              </div>

              {currentPlan?.projectContext.colors?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {currentPlan.projectContext.colors.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      {isEditing ? (
                        <>
                          <span className="text-xs font-mono text-gray-400 text-center">
                            {color.toUpperCase()}
                          </span>

                          <div className="relative group">
                            <input
                              type="color"
                              value={color}
                              onChange={(e) =>
                                arrayUpdater("projectContext.colors", i, e.target.value)
                              }
                              className="w-16 h-16 border-2 border-white/20 cursor-pointer bg-transparent hover:border-white/40 transition-colors"
                              style={{ backgroundColor: color }}
                            />
                          </div>

                          <button
                            onClick={() =>
                              arrayUpdater("projectContext.colors", i, undefined, true)
                            }
                            className="bg-red-600 hover:bg-red-500 text-white font-bold w-16 h-6 flex items-center justify-center transition-all duration-200 hover:scale-105"
                            aria-label={`Eliminar color ${color}`}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-mono text-gray-300 text-center">
                            {color.toUpperCase()}
                          </span>

                          <div
                            className="w-16 h-16 border-2 border-white/20 shadow-md"
                            style={{ backgroundColor: color }}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center">
                    <span className="text-gray-500 text-xl">?</span>
                  </div>
                  <p className="text-gray-400 text-sm">Sin colores definidos</p>
                  {isEditing && (
                    <p className="text-gray-500 text-xs mt-1">Haz clic en "Añadir Color" para empezar</p>
                  )}
                </div>
              )}
            </div>
          </section>

 <div className="flex gap-2 mt-5">
              {isEditing ? (
                <>
                  <Button
                    onClick={saveChanges}
                    className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-green-600/70 bg-green-600/50 border border-green-500/30"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button
                    onClick={cancelEditing}
                    variant="outline"
                    className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-red-600/70 bg-red-600/50 border border-red-500/30"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={startEditing}
                  variant="outline"
                  className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(158,158,149,0.7)] hover:brightness-110 transition-all duration-200"
                  style={{
                    background: "rgba(158, 158, 149, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow:
                      "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    borderRadius: "20px",
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          {/* Tareas: editable siempre (como en code2) */}
          <section className="p-6 rounded-xl border border-white/10 bg-black/30 space-y-4 shadow-lg mt-6">
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-3 gap-4">
  {/* Título */}
  <h2 className="text-2xl font-semibold text-center md:text-left">
    Lista de Tareas
  </h2>

  {/* Mensaje */}
  <div className="flex flex-col md:flex-row items-center justify-between bg-blue-900/30 border border-blue-600/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 gap-2">
    <div className="flex items-center">
      <p className="text-sm text-blue-200 text-center md:text-left">
        Para delegar una tarea, o pasarla a tu calendario haz clic en el botón
      </p>
      <div className="ml-2">
        <PlayIcon className="h-4 w-4" />
      </div>
    </div>

              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {(editedPlan?.tasks ?? plan?.tasks ?? []).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No hay tareas. ¡Añade la primera!</p>
                </div>
              ) : (
                (editedPlan?.tasks ?? plan?.tasks ?? []).map((task, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/10 group hover:bg-white/10 transition-colors">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 transition-colors ${
                          expandedTaskIndex === i 
                            ? 'text-green-400 bg-green-400/10' 
                            : 'text-gray-400 hover:text-green-400'
                        }`}
                        aria-label="Iniciar tarea"
                        onClick={() => setExpandedTaskIndex(expandedTaskIndex === i ? null : i)}
                      >
                        <PlayIcon className="h-4 w-4" />
                      </Button>
                    <div className="flex items-center gap-3 flex-grow">
                      {(isEditing || editedPlan) ? (
                        <input
                          type="text"
                          value={task}
                          onChange={(e) => {
                            if (!editedPlan) {
                              const newEditedPlan = plan ? JSON.parse(JSON.stringify(plan)) : null;
                              if (newEditedPlan) {
                                const updatedTasks = [...newEditedPlan.tasks];
                                updatedTasks[i] = e.target.value;
                                setEditedPlan({ ...newEditedPlan, tasks: updatedTasks });
                              }
                              return;
                            }
                            const updatedTasks = [...editedPlan.tasks];
                            updatedTasks[i] = e.target.value;
                            setEditedPlan({ ...editedPlan, tasks: updatedTasks });
                          }}
                          className="flex-grow bg-transparent border-none outline-none text-gray-200 placeholder:text-gray-400 hover:bg-black/20 focus:bg-black/30 rounded px-2 py-1 transition-colors"
                          placeholder="Editar tarea..."
                        />
                      ) : (
                        <span className="flex-grow text-gray-200 px-2 py-1">
                          {task}
                        </span>
                      )}
                    </div>

                    {(isEditing || editedPlan) && (
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            // attempt to focus the matching input - kept non-critical
                            const taskInputs = Array.from(document.querySelectorAll('input[type="text"]'));
                            const candidate = taskInputs.find((el) => (el as HTMLInputElement).value === task);
                            if (candidate) (candidate as HTMLInputElement).focus();
                          }}
                          className="h-8 w-8 flex items-center justify-center rounded-md bg-blue-600/20 text-blue-300 opacity-30 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-600/30 hover:text-blue-200"
                          aria-label="Editar tarea"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (!editedPlan) {
                              const newEditedPlan = plan ? JSON.parse(JSON.stringify(plan)) : null;
                              if (newEditedPlan) {
                                const updatedTasks = [...newEditedPlan.tasks];
                                updatedTasks.splice(i, 1);
                                setEditedPlan({ ...newEditedPlan, tasks: updatedTasks });
                              }
                              return;
                            }
                            const updatedTasks = [...editedPlan.tasks];
                            updatedTasks.splice(i, 1);
                            setEditedPlan({ ...editedPlan, tasks: updatedTasks });
                          }}
                          className="h-8 w-8 flex items-center justify-center rounded-md bg-red-600/20 text-red-300 opacity-30 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600/30 hover:text-red-200"
                          aria-label="Eliminar tarea"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    </div>
                    
                    {/* Fila de botones de acción */}
                    {expandedTaskIndex === i && (
                      <div className="flex gap-2 pl-10 pr-3 pb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-300 border-green-500/30 hover:bg-green-500/20 hover:text-white bg-green-500/10"
                          onClick={() => {
                            // TODO: Implementar funcionalidad de agregar a calendario
                            console.log(`Agregar tarea "${task}" al calendario`);
                          }}
                        >
                          📅 Agregar a mi calendario
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-purple-300 border-purple-500/30 hover:bg-purple-500/20 hover:text-white  bg-purple-500/10"
                          onClick={() => openDelegateModal(task)}
                        >
                          👥 Delegar
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex gap-2 pt-4 border-t border-white/10">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Añadir nueva tarea manualmente..."
                className="flex-grow bg-white/5 border border-white/20 focus:ring-indigo-400 focus:ring-1 focus:border-indigo-400 placeholder:text-gray-400 text-gray-100 rounded-lg px-3 py-2 outline-none transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTask.trim() !== "") {
                    if (!editedPlan) {
                      const newEditedPlan = plan ? JSON.parse(JSON.stringify(plan)) : null;
                      if (newEditedPlan) {
                        setEditedPlan({ ...newEditedPlan, tasks: [...newEditedPlan.tasks, newTask.trim()] });
                      }
                    } else {
                      setEditedPlan({ ...editedPlan, tasks: [...editedPlan.tasks, newTask.trim()] });
                    }
                    setNewTask("");
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newTask.trim() === "") return;
                  if (!editedPlan) {
                    const newEditedPlan = plan ? JSON.parse(JSON.stringify(plan)) : null;
                    if (newEditedPlan) {
                      setEditedPlan({ ...newEditedPlan, tasks: [...newEditedPlan.tasks, newTask.trim()] });
                    }
                  } else {
                    setEditedPlan({ ...editedPlan, tasks: [...editedPlan.tasks, newTask.trim()] });
                  }
                  setNewTask("");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="h-5 w-5" />
                Añadir Tarea
              </button>
            </div>
          </section>

          {/* Imagen final */}
          {plan.finalImageUrl && (
            <section className="p-6 rounded-lg border border-white/10 bg-black/20 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Imagen del Proyecto</h2>
              <img
                src={plan.finalImageUrl}
                alt="Imagen del proyecto"
                className="rounded-lg border border-white/10 w-full max-w-2xl"
              />
            </section>
          )}
        </main>
      </div>

      {/* Product modal (from code1) */}
      <ProductCheckModal
        isOpen={productModalOpen}
        onOpenChange={setProductModalOpen}
        onSave={handleProductSave}
      />

      {/* Modal de delegación */}
      <Dialog open={delegateModalOpen} onOpenChange={setDelegateModalOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Delegar Tarea</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium text-gray-200">Tarea a delegar:</Label>
              <p className="text-gray-300 bg-gray-800 p-2 rounded-md mt-1">{selectedTaskForDelegate}</p>
            </div>
            
            <div>
              <Label htmlFor="technologies" className="text-sm font-medium text-gray-200">
                Lista de tecnologías requeridas
              </Label>
              <Textarea
                id="technologies"
                placeholder="React, Node.js, MongoDB, etc."
                value={delegateForm.technologies}
                onChange={(e) => setDelegateForm(prev => ({ ...prev, technologies: e.target.value }))}
                className="mt-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="level" className="text-sm font-medium text-gray-200">
                Nivel requerido
              </Label>
              <Select
                value={delegateForm.level}
                onValueChange={(value) => setDelegateForm(prev => ({ ...prev, level: value }))}
              >
                <SelectTrigger className="mt-1 bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Selecciona el nivel" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="junior" className="text-white hover:bg-gray-700">Junior</SelectItem>
                  <SelectItem value="semi-senior" className="text-white hover:bg-gray-700">Semi-Senior</SelectItem>
                  <SelectItem value="senior" className="text-white hover:bg-gray-700">Senior</SelectItem>
                  <SelectItem value="lead" className="text-white hover:bg-gray-700">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2">
       
            <Button 
              onClick={handleDelegateSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!delegateForm.technologies.trim() || !delegateForm.level}
            >
              Delegar Tarea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
