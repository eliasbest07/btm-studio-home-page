"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function generateTasksAction(
  projectDescription: string,
  stylePrompt: string,
): Promise<{ tasks?: string[]; error?: string; suggestionId?: string }> {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OpenAI API key no está configurada." }
  }

  const fullPrompt = `
    Basado en la siguiente descripción de un proyecto y el estilo deseado, genera una lista de tareas de desarrollo y diseño.
    Descripción del Proyecto: "${projectDescription}"
    Estilo Deseado (basado en la siguiente inspiración): "${stylePrompt}"

    Por favor, devuelve una lista concisa de 5 a 10 tareas clave.
    Formato de respuesta estrictamente como un array JSON de strings. Ejemplo: ["Diseñar el logo", "Desarrollar la página de inicio", "Configurar la base de datos"]
  `

  try {
    const { text, finishReason, usage, suggestionId } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: fullPrompt,
      maxTokens: 300,
    })

    if (finishReason === "stop") {
      try {
        const jsonMatch = text.match(/(\[.*?\])/s)
        if (jsonMatch && jsonMatch[1]) {
          const parsedTasks = JSON.parse(jsonMatch[1])
          if (Array.isArray(parsedTasks) && parsedTasks.every((task) => typeof task === "string")) {
            return { tasks: parsedTasks, suggestionId }
          }
        }
        const fallbackTasks = text
          .split("\n")
          .map((line) => line.replace(/^- /g, "").trim())
          .filter((line) => line.length > 0)
        if (fallbackTasks.length > 0) {
          return { tasks: fallbackTasks, suggestionId }
        }
        return { error: "La respuesta de OpenAI no pudo ser parseada como una lista de tareas.", suggestionId }
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError)
        const fallbackTasks = text
          .split("\n")
          .map((line) => line.replace(/^- /g, "").trim())
          .filter((line) => line.length > 0)
        if (fallbackTasks.length > 0) {
          return { tasks: fallbackTasks, suggestionId }
        }
        return { error: "Error al parsear la respuesta de OpenAI.", suggestionId }
      }
    } else {
      return { error: `Generación de tareas interrumpida: ${finishReason}`, suggestionId }
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
    const { text, finishReason, usage, suggestionId } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: fullPrompt,
      maxTokens: 60,
    })

    if (finishReason === "stop" && text.trim().length > 0) {
      return { task: text.trim().replace(/^"|"$/g, ""), suggestionId } // Limpia comillas por si acaso
    } else {
      return { error: `No se pudo generar una nueva tarea. Razón: ${finishReason}`, suggestionId }
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
    const { text, finishReason, usage, suggestionId } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: prompt,
      maxTokens: 400, // Aumentar tokens para una descripción más completa
    })

    if (finishReason === "stop" && text.trim().length > 0) {
      return { enhancedDescription: text.trim(), suggestionId }
    } else {
      return { error: `No se pudo mejorar el resumen. Razón: ${finishReason}`, suggestionId }
    }
  } catch (error) {
    console.error("Error llamando a la API de OpenAI para mejorar el resumen:", error)
    if (error instanceof Error) {
      return { error: `Error de OpenAI: ${error.message}` }
    }
    return { error: "Ocurrió un error desconocido con la API de OpenAI." }
  }
}
