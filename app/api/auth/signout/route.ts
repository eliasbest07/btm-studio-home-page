import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  console.log("🔐 POST /api/auth/signout - Cerrando sesión");
  
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Cerrar sesión en Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("❌ Error cerrando sesión:", error);
      return NextResponse.json(
        { 
          error: "Error al cerrar sesión",
          details: error.message 
        },
        { status: 500 }
      );
    }

    console.log("✅ Sesión cerrada exitosamente");
    
    // Redirigir a la página de inicio o login
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
    
  } catch (error: any) {
    console.error("💥 Error crítico en signout:", error);
    
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Redirect GET requests to POST
  return NextResponse.redirect(new URL('/api/auth/signout', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), 307);
}