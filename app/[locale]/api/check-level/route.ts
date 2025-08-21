// app/[locale]/api/check-level/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function supabase() {
  return createRouteHandlerClient({ cookies });
}

// Opcional: responder OPTIONs para preflight (útil si usas fetch cross-origin)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Allow": "POST, OPTIONS",
    },
  });
}

export async function POST(req: Request) {
  try {
    const supabaseClient = supabase();

    // Obtener sesión y usuario actual
    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // obtener usuario de la tabla usuario donde en la colummna id_usuario sea igual a  userId
    // Leer body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    const { tareaId } = body;
    if (!tareaId) {
      return NextResponse.json({ error: "tareaId es requerido" }, { status: 400 });
    }

    // Insert en solicitud_nivel
    const { data, error } = await supabaseClient
      .from("solicitud_nivel")
      .insert({
        user_id: userId,
        tarea_id: tareaId,
        estado: "por_iniciar",
        comienzo: new Date(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error insertando solicitud_nivel:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Solicitud creada", solicitud: data }, { status: 201 });
  } catch (err: any) {
    console.error("Error en POST /api/check-level:", err);
    const msg = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
