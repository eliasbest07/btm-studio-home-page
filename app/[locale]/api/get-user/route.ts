import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function supabase() {
  return createRouteHandlerClient({ cookies });
}

export async function OPTIONS() {
  console.log("🔍 OPTIONS /api/get-user (locale)");
  return new NextResponse(null, {
    status: 204,
    headers: { 
      Allow: "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(req: Request) {
  console.log("🔍 GET /api/get-user (locale) - Iniciando solicitud");
  console.log("📍 URL:", req.url);
  
  try {
    const supabaseClient = supabase();
    console.log("✅ Cliente Supabase creado");

    // 1) Verificar sesión de usuario autenticado
    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession();

    console.log("🔐 Verificando sesión...");
    
    if (sessionError) {
      console.error("❌ Error de sesión:", sessionError);
      return NextResponse.json(
        { 
          error: "Error de autenticación: " + sessionError.message,
          details: sessionError,
          code: "SESSION_ERROR",
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 401 }
      );
    }

    if (!session?.user) {
      console.log("❌ No hay sesión activa");
      return NextResponse.json(
        { 
          error: "No autorizado. Debes iniciar sesión.",
          code: "NO_SESSION",
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 401 }
      );
    }

    const authUserId = session.user.id; // UUID de Supabase Auth
    console.log("✅ Usuario autenticado:", authUserId);

    // 2) Buscar usuario en la tabla 'usuario' por id_usuario (que corresponde al auth UUID)
    console.log("🔍 Buscando usuario en tabla 'usuario'...");
    
    const { data: userData, error: userError } = await supabaseClient
      .from("usuario")
      .select(`
        id,
        created_at,
        nombre,
        idea,
        avatar,
        user_auth,
        marco,
        barra_salud,
        role,
        id_usuario,
        correo,
        admin,
        solicitud_nivel,
        nivel,
        bio,
        username,
        fecha_nacimiento,
        ubicacion,
        enlace_github,
        enlace_web,
        enlace_linkedin
      `)
      .eq("id_usuario", authUserId)
      .single();

    if (userError) {
      console.error("❌ Error en consulta de usuario:", userError);
      
      // Si el usuario no existe en la tabla, podríamos crearlo automáticamente
      if (userError.code === 'PGRST116') { // No rows returned
        console.log("⚠️ Usuario no encontrado en tabla 'usuario'");
        return NextResponse.json(
          { 
            error: "Usuario no encontrado en la base de datos.",
            code: "USER_NOT_FOUND",
            authUser: {
              id: session.user.id,
              email: session.user.email,
              user_metadata: session.user.user_metadata
            },
            suggestion: "El usuario existe en auth pero no en la tabla 'usuario'. Usa POST para crearlo.",
            timestamp: new Date().toISOString(),
            url: req.url
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { 
          error: "Error al obtener datos del usuario",
          details: userError,
          code: userError.code,
          message: userError.message,
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 500 }
      );
    }

    if (!userData) {
      console.log("❌ No se encontraron datos del usuario");
      return NextResponse.json(
        { 
          error: "Usuario no encontrado en la tabla 'usuario'.",
          code: "USER_NOT_FOUND",
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 404 }
      );
    }

    console.log("✅ Usuario encontrado:", userData.username || userData.nombre);

    // 3) Combinar datos de auth con datos de la tabla usuario
    const completeUserData = {
      // Datos de Supabase Auth
      auth: {
        id: session.user.id,
        email: session.user.email,
        email_confirmed_at: session.user.email_confirmed_at,
        last_sign_in_at: session.user.last_sign_in_at,
        user_metadata: session.user.user_metadata,
      },
      // Datos de la tabla usuario
      profile: {
        id: userData.id,
        created_at: userData.created_at,
        nombre: userData.nombre,
        idea: userData.idea,
        avatar: userData.avatar,
        user_auth: userData.user_auth,
        marco: userData.marco,
        barra_salud: userData.barra_salud,
        role: userData.role,
        id_usuario: userData.id_usuario,
        correo: userData.correo,
        admin: userData.admin,
        solicitud_nivel: userData.solicitud_nivel,
        nivel: userData.nivel,
        bio: userData.bio,
        username: userData.username,
        fecha_nacimiento: userData.fecha_nacimiento,
        ubicacion: userData.ubicacion,
        enlace_github: userData.enlace_github,
        enlace_web: userData.enlace_web,
        enlace_linkedin: userData.enlace_linkedin,
      }
    };

    console.log("✅ Datos del usuario obtenidos exitosamente");
    
    return NextResponse.json(
      { 
        success: true,
        message: "Datos del usuario obtenidos exitosamente",
        user: completeUserData,
        timestamp: new Date().toISOString(),
        url: req.url
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("💥 Error crítico en GET /api/get-user (locale):", error);
    
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: {
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          name: error.name,
        },
        timestamp: new Date().toISOString(),
        url: req.url
      },
      { status: 500 }
    );
  }
}

// Método POST para crear usuario si no existe
export async function POST(req: Request) {
  console.log("🔍 POST /api/get-user (locale) - Creando usuario");
  console.log("📍 URL:", req.url);
  
  try {
    const supabaseClient = supabase();

    // 1) Verificar sesión
    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession();

    if (sessionError) {
      console.error("❌ Error de sesión:", sessionError);
      return NextResponse.json(
        { 
          error: "Error de autenticación: " + sessionError.message,
          details: sessionError,
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 401 }
      );
    }

    if (!session?.user) {
      console.log("❌ No hay sesión activa");
      return NextResponse.json(
        { 
          error: "No autorizado. Debes iniciar sesión.",
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 401 }
      );
    }

    const authUserId = session.user.id;
    const authEmail = session.user.email;
    console.log("✅ Creando usuario para:", authUserId);

    // 2) Obtener datos del body (opcionales para crear perfil básico)
    let body = {};
    try {
      body = await req.json();
      console.log("📝 Datos recibidos:", body);
    } catch (parseError) {
      console.log("⚠️ No se pudo parsear el body, usando datos por defecto");
    }
    const {
      nombre,
      username,
      bio,
      ubicacion,
      fecha_nacimiento,
      enlace_github,
      enlace_web,
      enlace_linkedin
    } = body as any;

    // 3) Verificar si el usuario ya existe
    console.log("🔍 Verificando si el usuario ya existe...");
    
    const { data: existingUser, error: checkError } = await supabaseClient
      .from("usuario")
      .select("id")
      .eq("id_usuario", authUserId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("❌ Error verificando usuario existente:", checkError);
      return NextResponse.json(
        { 
          error: "Error verificando usuario existente",
          details: checkError,
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 500 }
      );
    }

    if (existingUser) {
      console.log("⚠️ El usuario ya existe");
      return NextResponse.json(
        { 
          error: "El usuario ya existe en la base de datos.",
          code: "USER_EXISTS",
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 409 }
      );
    }

    // 4) Crear nuevo usuario en la tabla
    console.log("🆕 Creando nuevo usuario...");
    
    const newUserData = {
      id_usuario: authUserId,
      correo: authEmail,
      nombre: nombre || session.user.user_metadata?.full_name || "Usuario",
      username: username || `user_${Date.now()}`,
      bio: bio || null,
      ubicacion: ubicacion || null,
      fecha_nacimiento: fecha_nacimiento || null,
      enlace_github: enlace_github || null,
      enlace_web: enlace_web || null,
      enlace_linkedin: enlace_linkedin || null,
      role: "empleado",
      admin: false,
      nivel: 0
    };

    console.log("📝 Datos a insertar:", newUserData);

    const { data: newUser, error: createError } = await supabaseClient
      .from("usuario")
      .insert(newUserData)
      .select()
      .single();

    if (createError) {
      console.error("❌ Error creando usuario:", createError);
      return NextResponse.json(
        { 
          error: "Error al crear usuario",
          details: createError,
          code: createError.code,
          message: createError.message,
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 500 }
      );
    }

    console.log("✅ Usuario creado exitosamente:", newUser.username);

    return NextResponse.json(
      {
        success: true,
        message: "Usuario creado exitosamente",
        user: {
          auth: {
            id: session.user.id,
            email: session.user.email,
          },
          profile: newUser
        },
        timestamp: new Date().toISOString(),
        url: req.url
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("💥 Error crítico en POST /api/get-user (locale):", error);
    
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: {
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          name: error.name,
        },
        timestamp: new Date().toISOString(),
        url: req.url
      },
      { status: 500 }
    );
  }
}
// Método PATCH para actualizar datos del usuario
export async function PATCH(req: Request) {
  console.log("🔍 PATCH /api/get-user (locale) - Actualizando usuario");
  console.log("📍 URL:", req.url);
  
  try {
    const supabaseClient = supabase();

    // 1) Verificar sesión
    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession();

    if (sessionError) {
      console.error("❌ Error de sesión:", sessionError);
      return NextResponse.json(
        { 
          error: "Error de autenticación: " + sessionError.message,
          details: sessionError,
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 401 }
      );
    }

    if (!session?.user) {
      console.log("❌ No hay sesión activa");
      return NextResponse.json(
        { 
          error: "No autorizado. Debes iniciar sesión.",
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 401 }
      );
    }

    const authUserId = session.user.id;
    console.log("✅ Actualizando usuario:", authUserId);

    // 2) Obtener datos del body
    let body = {};
    try {
      body = await req.json();
      console.log("📝 Datos a actualizar:", body);
    } catch (parseError) {
      console.error("❌ Error parseando body:", parseError);
      return NextResponse.json(
        { 
          error: "Datos inválidos en la petición",
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 400 }
      );
    }

    const {
      nombre,
      username,
      bio,
      ubicacion,
      fecha_nacimiento,
      enlace_github,
      enlace_web,
      enlace_linkedin,
      avatar
    } = body as any;

    // 3) Verificar que el usuario existe
    console.log("🔍 Verificando que el usuario existe...");
    
    const { data: existingUser, error: checkError } = await supabaseClient
      .from("usuario")
      .select("id, username")
      .eq("id_usuario", authUserId)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        console.log("❌ Usuario no encontrado");
        return NextResponse.json(
          { 
            error: "Usuario no encontrado en la base de datos.",
            code: "USER_NOT_FOUND",
            timestamp: new Date().toISOString(),
            url: req.url
          },
          { status: 404 }
        );
      }
      
      console.error("❌ Error verificando usuario:", checkError);
      return NextResponse.json(
        { 
          error: "Error verificando usuario",
          details: checkError,
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 500 }
      );
    }

    // 4) Preparar datos para actualizar (solo campos que no sean undefined)
    const updateData: any = {};
    
    if (nombre !== undefined) updateData.nombre = nombre;
    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (ubicacion !== undefined) updateData.ubicacion = ubicacion;
    if (fecha_nacimiento !== undefined) updateData.fecha_nacimiento = fecha_nacimiento;
    if (enlace_github !== undefined) updateData.enlace_github = enlace_github;
    if (enlace_web !== undefined) updateData.enlace_web = enlace_web;
    if (enlace_linkedin !== undefined) updateData.enlace_linkedin = enlace_linkedin;
    if (avatar !== undefined) updateData.avatar = avatar;

    console.log("📝 Campos a actualizar:", Object.keys(updateData));

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { 
          error: "No se proporcionaron campos para actualizar",
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 400 }
      );
    }

    // 5) Actualizar usuario en la base de datos
    console.log("🔄 Actualizando usuario en la base de datos...");
    
    const { data: updatedUser, error: updateError } = await supabaseClient
      .from("usuario")
      .update(updateData)
      .eq("id_usuario", authUserId)
      .select()
      .single();

    if (updateError) {
      console.error("❌ Error actualizando usuario:", updateError);
      return NextResponse.json(
        { 
          error: "Error al actualizar usuario",
          details: updateError,
          code: updateError.code,
          message: updateError.message,
          timestamp: new Date().toISOString(),
          url: req.url
        },
        { status: 500 }
      );
    }

    console.log("✅ Usuario actualizado exitosamente:", updatedUser.username);

    return NextResponse.json(
      {
        success: true,
        message: "Usuario actualizado exitosamente",
        user: {
          auth: {
            id: session.user.id,
            email: session.user.email,
          },
          profile: updatedUser
        },
        updatedFields: Object.keys(updateData),
        timestamp: new Date().toISOString(),
        url: req.url
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("💥 Error crítico en PATCH /api/get-user (locale):", error);
    
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: {
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          name: error.name,
        },
        timestamp: new Date().toISOString(),
        url: req.url
      },
      { status: 500 }
    );
  }
}