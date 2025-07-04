
import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

// Inicializa el cliente de Supabase.
// Es seguro usar las claves aquí porque este código SOLO se ejecuta en el servidor.
const supabase = createClient(
  'https://efiarbtzeotqfykaqpjq.supabase.co',
  process.env.SUPABASE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { projectName, tasks, imageUrl } = await req.json(); // <-- imageUrl añadido

    if (!projectName || !tasks || !Array.isArray(tasks)) {
      return NextResponse.json({ error: 'Datos inválidos. Se requiere nombre del proyecto y una lista de tareas.' }, { status: 400 });
    }

    // 1. Obtener la IP y el país del solicitante
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
    let country = 'Unknown';
    
    // Usamos un servicio gratuito para obtener el país desde la IP
    try {
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        if(geoResponse.ok) {
            const geoData = await geoResponse.json();
            country = geoData.country_name || 'Unknown';
        }
    } catch (geoError) {
        console.error("Error fetching geolocation data:", geoError);
        // Continuamos aunque falle la geolocalización
    }


    // 2. Insertar el proyecto en la base de datos
    const { data: projectData, error: projectError } = await supabase
      .from('proyectos')
      .insert({
        nombre: projectName,
        ip_creacion: ip,
        pais_creacion: country,
        imagen_url: imageUrl, // <-- Guardamos la URL de la imagen
      })
      .select()
      .single();

    if (projectError) {
      console.error('Error en Supabase (Proyecto):', projectError);
      throw new Error(projectError.message);
    }

    // 3. Preparar y insertar las tareas asociadas al proyecto
    const tasksToInsert = tasks.map((taskDesc: string) => ({
      descripcion: taskDesc,
      proyecto_id: projectData.id,
      estado: 'pendiente', // Estado por defecto
    }));

    const { error: tasksError } = await supabase
      .from('tareas')
      .insert(tasksToInsert);

    if (tasksError) {
      console.error('Error en Supabase (Tareas):', tasksError);
      // Si fallan las tareas, sería bueno eliminar el proyecto creado para mantener la consistencia.
      await supabase.from('proyectos').delete().match({ id: projectData.id });
      throw new Error(tasksError.message);
    }

    return NextResponse.json({ message: 'Proyecto creado con éxito', projectId: projectData.id }, { status: 201 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
