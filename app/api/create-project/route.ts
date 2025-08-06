// app/api/proyectos/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function supabase() {
  return createRouteHandlerClient({ cookies });
}

export async function POST(req: Request) {
  try {
    const { projectName, tasks, imageUrl } = await req.json();

    if (!projectName || !tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Datos inválidos. Se requiere nombre del proyecto y una lista de tareas.' },
        { status: 400 }
      );
    }

    // 1. Obtener IP y país
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';
    let country = 'Unknown';

    try {
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        country = geoData.country_name || 'Unknown';
      }
    } catch (geoError) {
      console.error('Error fetching geolocation data:', geoError);
    }

    // 2. Insertar el proyecto
    const { data: projectData, error: projectError } = await supabase()
      .from('proyectos')
      .insert({
        nombre: projectName,
        ip_creacion: ip,
        pais_creacion: country,
        imagen_url: imageUrl,
      })
      .select()
      .single();

    if (projectError) {
      console.error('Error en Supabase (Proyecto):', projectError);
      return NextResponse.json({ error: projectError.message }, { status: 400 });
    }

    // 3. Insertar las tareas
    const tasksToInsert = tasks.map((taskDesc: string) => ({
      descripcion: taskDesc,
      proyecto_id: projectData.id,
      estado: 'pendiente',
    }));

    const { error: tasksError } = await supabase()
      .from('tareas')
      .insert(tasksToInsert);

    if (tasksError) {
      console.error('Error en Supabase (Tareas):', tasksError);
      await supabase().from('proyectos').delete().match({ id: projectData.id });
      return NextResponse.json({ error: tasksError.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Proyecto creado con éxito', projectId: projectData.id },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}