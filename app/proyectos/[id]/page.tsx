
import { createClient } from '@supabase/supabase-js';
import { Lock, Unlock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import EditProjectClient from './EditProjectClient'; // Componente cliente para la interactividad

// Creamos un cliente de Supabase que se ejecuta en el servidor
// Usamos la SERVICE KEY para poder leer los datos del proyecto incluso si es privado
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

interface ProjectPageProps {
  params: { id: string };
}

// Esta función se ejecuta en el servidor para obtener los datos antes de renderizar la página
async function getProjectData(projectId: string) {
  const { data: proyecto, error: projectError } = await supabase
    .from('proyectos')
    .select('*')
    .eq('id', projectId)
    .single();

  if (projectError) {
    console.error('Error fetching project:', projectError);
    return { proyecto: null, tareas: [] };
  }

  const { data: tareas, error: tasksError } = await supabase
    .from('tareas')
    .select('*')
    .eq('proyecto_id', projectId);

  if (tasksError) {
    console.error('Error fetching tasks:', tasksError);
    // Devolvemos el proyecto aunque fallen las tareas
    return { proyecto, tareas: [] }; 
  }

  return { proyecto, tareas };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { proyecto, tareas } = await getProjectData(params.id);

  if (!proyecto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
        <p className="mb-6">El proyecto que buscas no existe o no tienes permiso para verlo.</p>
        <Link href="/">
        <Button
          className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(158,158,149,0.3)] hover:brightness-110 transition-all duration-200"
          style={{
            background: `rgba(158, 158, 149, 0.2)`,
            // Removed invalid hover property
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow:
              '2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: '20px',
          }}
        >
          ⬅ Volver al Inicio
        </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8">
          <Link href="/" className="inline-flex items-center mb-4">
          <Button
          className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(158,158,149,0.3)] hover:brightness-110 transition-all duration-200"
          style={{
            background: `rgba(158, 158, 149, 0.2)`,
            // Removed invalid hover property
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow:
              '2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: '20px',
          }}
        >
          ⬅ Volver al Inicio
        </Button>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-50">{proyecto.nombre}</h1>
              <p className="text-sm text-gray-400 mt-2">ID del Proyecto: {proyecto.id}</p>
            </div>
            {/* Pasamos los datos al componente cliente */}
            <EditProjectClient projectId={proyecto.id} initialIsPublic={proyecto.publico} />
          </div>
        </header>

        <main>
          <div className="p-6 rounded-lg border border-white/10 bg-black/20">
            <h2 className="text-2xl font-semibold mb-4">Tareas del Proyecto</h2>
            {tareas && tareas.length > 0 ? (
              <ul className="space-y-3">
                {tareas.map((task) => (
                  <li key={task.id} className="p-3 bg-white/5 rounded-md border border-white/10">
                    <p className="font-medium">{task.descripcion}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${task.estado === 'completada' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {task.estado}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Este proyecto aún no tiene tareas.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
