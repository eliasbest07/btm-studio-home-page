import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { tarea_id, usuario_id } = await request.json()

    // Validar que los datos requeridos estén presentes
    if (!tarea_id || !usuario_id) {
      return NextResponse.json(
        { error: "tarea_id y usuario_id son requeridos" },
        { status: 400 }
      )
    }

    // Insertar nueva propuesta en Supabase
    const { data, error } = await supabase
      .from('propuestas')
      .insert([
        {
          tarea_id: tarea_id,
          usuario_id: usuario_id,
          cuerpo: "Propuesta creada desde Total-Time.app", // Texto por defecto
          fecha: new Date().toISOString()
        }
      ])
      .select('id')
      .single()

    if (error) {
      console.error('Error insertando propuesta:', error)
      return NextResponse.json(
        { error: "Error al crear la propuesta: " + error.message },
        { status: 500 }
      )
    }

    // Retornar el ID de la nueva propuesta
    return NextResponse.json({
      success: true,
      propuesta_id: data.id,
      message: "Propuesta creada exitosamente"
    })

  } catch (error) {
    console.error('Error inesperado:', error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}