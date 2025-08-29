import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function supabase() {
  return createRouteHandlerClient({ cookies });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: "POST, OPTIONS" },
  });
}

export async function POST(req) {
  try {
    const supabaseClient = supabase();

    // 1) Sesión
    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "No autorizado. Debes iniciar sesión." }, { status: 401 });
    }

    const authUserId = session.user.id;

    // 2) Body
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Body inválido" }, { status: 400 });

    const { tareaId } = body;
    if (!tareaId) return NextResponse.json({ error: "tareaId es requerido" }, { status: 400 });

    // 3) Mapear authUserId -> usuario.id
    const { data: usuarioRow, error: usrErr } = await supabaseClient
      .from("usuario")
      .select("id")
      .eq("id_usuario", authUserId)
      .single();

    if (usrErr || !usuarioRow) {
      return NextResponse.json(
        { error: "Usuario no encontrado en tabla 'usuario'." },
        { status: 404 }
      );
    }

    const userId = usuarioRow.id;

    // 4) Verificar si ya existe una propuesta con estado "totaltime" para esta tarea y usuario
    const { data: existingPropuesta, error: checkErr } = await supabaseClient
      .from('propuestas')
      .select('id')
      .eq('tarea_id', tareaId)
      .eq('usuario_id', userId)
      .eq('estado', 'totaltime')
      .single();

    let propuestaData;

    if (existingPropuesta && !checkErr) {
      // Ya existe una propuesta con estado totaltime, usar esa
      propuestaData = { id: existingPropuesta.id };
    } else {
      // Crear nueva propuesta con estado "totaltime"
      const { data: newPropuesta, error: insertErr } = await supabaseClient
        .from('propuestas')
        .insert([
          {
            tarea_id: tareaId,
            usuario_id: userId,
            cuerpo: "Propuesta enviada a Total-Time para registro de progreso",
            fecha: new Date().toISOString(),
            estado: "totaltime"
          }
        ])
        .select()
        .single();

      if (insertErr) {
        console.error("Error creando propuesta:", insertErr);
        return NextResponse.json({ error: insertErr.message }, { status: 500 });
      }

      propuestaData = newPropuesta;
    }

    // 5) Generar URL de Total-Time
    const totalTimeUrl = `https://localhost/3000/propuestas/${propuestaData.id}`;

    return NextResponse.json(
      { 
        message: "Propuesta creada y enviada a Total-Time", 
        propuesta: propuestaData, 
        totalTimeUrl 
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("Error en POST /api/send-to-totaltime:", err);
    const msg = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}