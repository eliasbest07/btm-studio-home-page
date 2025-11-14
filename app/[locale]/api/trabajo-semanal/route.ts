import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function supabase() {
  return createRouteHandlerClient({ cookies });
}

export async function POST(req: Request) {
  try {
    const supabaseClient = supabase();

    // Obtener datos del formulario
    const { nombre, email, whatsapp, horario } = await req.json();

    // Validar datos requeridos
    if (!nombre || !email || !whatsapp || !horario) {
      return NextResponse.json(
        {
          error: "Todos los campos son requeridos.",
        },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Por favor ingresa un correo electrónico válido.",
        },
        { status: 400 }
      );
    }

    // Validar horario
    if (horario !== "manana" && horario !== "tarde") {
      return NextResponse.json(
        {
          error: "Horario inválido.",
        },
        { status: 400 }
      );
    }

    // Obtener información adicional (IP y país)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
    let country = "Unknown";

    try {
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        country = geoData.country_name || "Unknown";
      }
    } catch (geoError) {
      console.error("Error fetching geolocation data:", geoError);
    }

    // Insertar aplicación en Supabase
    const { data: applicationData, error: applicationError } =
      await supabaseClient
        .from("aplicaciones_trabajo_semanal")
        .insert({
          nombre: nombre,
          email: email,
          whatsapp: whatsapp,
          horario: horario,
          ip_aplicacion: ip,
          pais_aplicacion: country,
          fecha_aplicacion: new Date().toISOString(),
        })
        .select()
        .single();

    if (applicationError) {
      console.error(
        "Error en Supabase (Aplicación):",
        applicationError
      );
      return NextResponse.json(
        { error: applicationError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Aplicación enviada con éxito",
        applicationId: applicationData.id,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Un error desconocido ocurrió.";
    console.error("Error en API trabajo-semanal:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
