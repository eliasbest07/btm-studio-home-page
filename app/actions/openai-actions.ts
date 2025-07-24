"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"



export async function generateTasksAction(
  baseTemplate: string,
  utilityDescription: string, 
  projectDescription: string,
  stylePrompt: string,

): Promise<{ tasks?: string[]; error?: string; suggestionId?: string }> {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OpenAI API key no está configurada." }
  }

  const fullPrompt = `
  Eres un planificador sénior de proyectos de software.
  
  Devuelve **solo** un array JSON con **5-8** tareas breves, relevantes y accionables, en orden cronológico, que aporten resultados alcanzables en el corto plazo.
  
  Entradas
  - Plantilla base: “\${baseTemplate}”
  - Utilidad / caso de uso (opcional): “\${utilityDescription}”
  - Descripción del proyecto (obligatoria): “\${projectDescription}”
  - Paleta de colores (opcional): “\${colorPalette}”
  - Inspiración de diseño (opcional): “\${stylePrompt}”
  
  Guías
  1. Empieza con las tareas fundamentales para “\${baseTemplate}”.
  2. Si se aporta utilidad/caso de uso, alinea las tareas con ello.
  3. Menciona la paleta de colores solo en tareas de diseño/branding.
  4. Si hay inspiración de diseño, coloca sus tareas preparatorias al inicio.
  5. Asegúrate de que cada tarea sea relevante y produzca un resultado tangible en poco tiempo.
  6. La salida **debe** ser exclusivamente un array JSON, por ejemplo:  
     ["Crear repositorio", "Configurar CI/CD", "Diseñar wireframes", "Aplicar paleta de colores", "Implementar autenticación"].`

  try {
    const { text, finishReason, usage } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: fullPrompt,
      maxTokens: 300,
    })

    if (finishReason === "stop") {
      try {
        const jsonMatch = text.match(/\[[\s\S]*?\]/);  
        if (jsonMatch && jsonMatch[1]) {
          const parsedTasks = JSON.parse(jsonMatch[1])
          console.log(text)
          if (Array.isArray(parsedTasks) && parsedTasks.every((task) => typeof task === "string")) {
            return { tasks: parsedTasks }
          }
        }
        const fallbackTasks = text
          .split("\n")
          .map((line) => line.replace(/^- /g, "").trim())
          .filter((line) => line.length > 0)
        if (fallbackTasks.length > 0) {
          return { tasks: fallbackTasks }
        }
        return { error: "La respuesta de OpenAI no pudo ser parseada como una lista de tareas." }
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError)

        const fallbackTasks = text
          .split("\n")
          .map((line) => line.replace(/^- /g, "").trim())
          .filter((line) => line.length > 0)
        if (fallbackTasks.length > 0) {
          return { tasks: fallbackTasks }
        }
        return { error: "Error al parsear la respuesta de OpenAI." }
      }
    } else {
      return { error: `Generación de tareas interrumpida: ${finishReason}` }
    }
  } catch (error) {
    console.error("Error llamando a la API de OpenAI:", error)
    if (error instanceof Error) {
      return { error: `Error de OpenAI: ${error.message}` }
    }
    return { error: "Ocurrió un error desconocido con la API de OpenAI." }
  }
}

export async function generateSingleTaskAction(
  projectDescription: string,
  stylePrompt: string,
  existingTasks: string[],
): Promise<{ task?: string; error?: string; suggestionId?: string }> {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OpenAI API key no está configurada." }
  }

  const fullPrompt = `
    Contexto del Proyecto:
    - Descripción: "${projectDescription}"
    - Estilo: "${stylePrompt}"

    Lista de Tareas Existentes:
    ${existingTasks.map((t) => `- ${t}`).join("\n")}

    Basado en el contexto y las tareas existentes, sugiere una única tarea nueva y relevante que complemente el plan.
    La tarea debe ser concisa y accionable.
    NO repitas ninguna de las tareas existentes.
    Responde únicamente con el texto de la nueva tarea, sin comillas ni formatos adicionales.
    Ejemplo de respuesta: "Implementar la autenticación de usuarios"
  `

  try {
    const { text, finishReason, usage } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: fullPrompt,
      maxTokens: 60,
    })

    if (finishReason === "stop" && text.trim().length > 0) {
      return { task: text.trim().replace(/^"|"$/g, "") } // Limpia comillas por si acaso
    } else {
      return { error: `No se pudo generar una nueva tarea. Razón: ${finishReason}` }
    }
  } catch (error) {
    console.error("Error llamando a la API de OpenAI para una sola tarea:", error)
    if (error instanceof Error) {
      return { error: `Error de OpenAI: ${error.message}` }
    }
    return { error: "Ocurrió un error desconocido con la API de OpenAI." }
  }
}

export async function enhanceSummaryAction(
  currentDescription: string,
  currentStylePrompt: string,
): Promise<{ enhancedDescription?: string; error?: string; suggestionId?: string }> {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OpenAI API key no está configurada." }
  }

  const prompt = `
    Dada la siguiente descripción de un proyecto y su estilo de inspiración, por favor, mejora y expande la descripción del proyecto para que sea más completa y atractiva. Incorpora ideas productivas o detalles adicionales que podrían enriquecer el concepto. Mantén el estilo de inspiración en mente.

    Descripción Actual del Proyecto:
    "${currentDescription}"

    Estilo de Inspiración Actual:
    "${currentStylePrompt}"

    Responde únicamente con la nueva descripción mejorada del proyecto. No incluyas el estilo de inspiración en tu respuesta, solo la descripción.
    La descripción debe ser un solo párrafo o un texto coherente.
  `

  try {
    const { text, finishReason, usage } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: prompt,
      maxTokens: 400, // Aumentar tokens para una descripción más completa
    })

    if (finishReason === "stop" && text.trim().length > 0) {
      return { enhancedDescription: text.trim() }
    } else {
      return { error: `No se pudo mejorar el resumen. Razón: ${finishReason}` }
    }
  } catch (error) {
    console.error("Error llamando a la API de OpenAI para mejorar el resumen:", error)
    if (error instanceof Error) {
      return { error: `Error de OpenAI: ${error.message}` }
    }
    return { error: "Ocurrió un error desconocido con la API de OpenAI." }
  }
}

export async function generateImageAction(
  projectDescription: string,
  stylePrompt: string,
): Promise<{ imageUrl?: string; error?: string }> {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "Variables de entorno de OpenAI o Supabase no configuradas." };
  }

  // Importar OpenAI directamente
  const OpenAI = await import("openai");
  const { createClient } = await import('@supabase/supabase-js');
  
  // Cliente de OpenAI
  const openai = new OpenAI.default({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  // Cliente de Supabase con service key para poder escribir en el storage
  const supabaseAdmin = createClient(  process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!);

  const imagePrompt = `
    Visualización de un diseño de sitio web. 
    Estilo: ${stylePrompt}. 
    Descripción del concepto: ${projectDescription}. 
    Una imagen digital de alta calidad, fotorrealista, que muestre la interfaz de usuario de una página web.
  `;

  try {
    // 1. Generar la imagen con DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "standard",
      response_format: "url", // Cambiar a URL primero para obtener la imagen
    });

    if (!response.data || !response.data[0] || !response.data[0].url) {
      return { error: "La API de OpenAI no pudo generar la imagen." };
    }

    // 2. Descargar la imagen desde la URL
    const imageUrl = response.data[0].url;
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      return { error: "No se pudo descargar la imagen generada." };
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // 3. Subir la imagen a Supabase Storage
    const fileName = `project-image-${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('imagenes-proyectos') // El nombre de tu bucket
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (uploadError) {
      console.error("Error subiendo a Supabase Storage:", uploadError);
      throw new Error(uploadError.message);
    }

    // 4. Obtener la URL pública de la imagen subida
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('imagenes-proyectos')
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
        return { error: "No se pudo obtener la URL pública de la imagen." };
    }

    // 5. Devolver la URL pública de Supabase
    return { imageUrl: publicUrlData.publicUrl };

  } catch (error) {
    console.error("Error en generateImageAction:", error);
    if (error instanceof Error) {
      return { error: `Error en la acción del servidor: ${error.message}` };
    }
    return { error: "Ocurrió un error desconocido en la acción de generar imagen." };
  }
}