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
    const { nombre, email, whatsapp, locale, captchaVerified } = await req.json();

    // Validar datos requeridos
    if (!nombre || !email || !whatsapp) {
      return NextResponse.json(
        {
          error: "Todos los campos son requeridos.",
        },
        { status: 400 }
      );
    }

    // Validar que el CAPTCHA fue verificado
    if (!captchaVerified) {
      return NextResponse.json(
        {
          error: "Debe completar la verificación de seguridad (CAPTCHA).",
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

    // Obtener información adicional del request
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "127.0.0.1";

    const userAgent = req.headers.get("user-agent") ?? "Unknown";

    // Insertar aplicación en Supabase
    const { data: applicationData, error: applicationError } =
      await supabaseClient
        .from("trabajo_semanal_aplicaciones")
        .insert({
          nombre,
          email,
          whatsapp,
          captcha_verified: captchaVerified,
          locale: locale || "es",
          ip_address: ipAddress,
          user_agent: userAgent,
        })
        .select()
        .single();

    if (applicationError) {
      console.error(
        "Error en Supabase (Aplicación):",
        applicationError
      );

      // Manejar errores de duplicados (unique constraint violation)
      if (applicationError.code === "23505") {
        // Verificar qué campo está duplicado
        if (applicationError.message.includes("trabajo_semanal_aplicaciones_email_key")) {
          return NextResponse.json(
            {
              error: locale === "es"
                ? "Este correo electrónico ya ha sido registrado. Si ya aplicaste anteriormente, te contactaremos pronto."
                : "This email has already been registered. If you've already applied, we'll contact you soon.",
              field: "email"
            },
            { status: 409 }
          );
        }

        if (applicationError.message.includes("trabajo_semanal_aplicaciones_whatsapp_key")) {
          return NextResponse.json(
            {
              error: locale === "es"
                ? "Este número de WhatsApp ya ha sido registrado. Si ya aplicaste anteriormente, te contactaremos pronto."
                : "This WhatsApp number has already been registered. If you've already applied, we'll contact you soon.",
              field: "whatsapp"
            },
            { status: 409 }
          );
        }
      }

      // Error genérico
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
