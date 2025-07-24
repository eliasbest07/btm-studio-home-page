// app/api/tareas/[id]/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function supabase() {
  return createRouteHandlerClient({ cookies });
}

// GET /api/tareas/123  → devuelve la tarea
export async function GET(_req, { params }) {
  const { data, error } = await supabase()
    .from('tareas')
    .select('id, created_at, descripcion, estado, proyecto_id')
    .eq('id', params.id)
    .single();

  if (error || !data)
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  return NextResponse.json(data);
}

// PUT /api/tareas/123  → actualiza descripcion / estado
export async function PUT(req, { params }) {
  try {
    const { descripcion, estado } = await req.json();
    if (!descripcion || !estado)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const { data, error } = await supabase()
      .from('tareas')
      .update({ descripcion, estado })
      .eq('id', params.id)
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

// DELETE /api/tareas/123  → elimina la tarea
export async function DELETE(_req, { params }) {
  const { error } = await supabase()
    .from('tareas')
    .delete()
    .eq('id', params.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}