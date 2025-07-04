
import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

// Usamos la SERVICE KEY para poder modificar proyectos aunque estén privados (bypass RLS)
const supabase = createClient(
  'https://efiarbtzeotqfykaqpjq.supabase.co',
  process.env.SUPABASE_KEY!
);

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id;

    // 1. Obtener el estado actual del proyecto
    const { data: project, error: fetchError } = await supabase
      .from('proyectos')
      .select('publico')
      .eq('id', projectId)
      .single();

    if (fetchError) {
      throw new Error('Proyecto no encontrado.');
    }

    // 2. Cambiar el estado de publico a su opuesto
    const newStatus = !project.publico;
    const { error: updateError } = await supabase
      .from('proyectos')
      .update({ publico: newStatus })
      .eq('id', projectId);

    if (updateError) {
      throw new Error('Error al actualizar la privacidad del proyecto.');
    }

    return NextResponse.json({ message: 'Privacidad actualizada con éxito', newStatus: newStatus }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
