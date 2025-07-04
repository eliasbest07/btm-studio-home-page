# Guía de Desarrollo para el Asistente Gemini

Este documento sirve como guía para el asistente de IA Gemini, asegurando que el desarrollo y las modificaciones en el proyecto "BTM Studio Home Page" se realicen de manera consistente, segura y alineada con las convenciones establecidas.

## 1. Resumen del Proyecto

- **Nombre:** BTM Studio Home Page
- **Descripción:** Es el sitio web corporativo y portafolio de BTM Studio, una agencia de desarrollo. El sitio está diseñado para mostrar proyectos, casos de éxito y los servicios ofrecidos.
- **Objetivo Principal:** Servir como una herramienta de marketing digital, atraer nuevos clientes y presentar la marca de la empresa.

## 2. Stack Tecnológico

- **Framework Frontend:** Next.js (v15) con React (v19)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes UI:** shadcn/ui, Radix UI
- **Backend y Servicios:**
  - **Supabase:** Para base de datos, autenticación y/o almacenamiento.
  - **OpenAI:** Para funcionalidades basadas en IA.
- **Linting:** ESLint (`next lint`)

## 3. Directrices de Desarrollo

### Foco Principal: Calidad y Consistencia

Mi principal objetivo es ayudarte a **expandir funcionalidades, resolver errores y mantener la calidad del código**. Para ello, seguiré estrictamente las siguientes directrices.

### a. Estilo de Código y Convenciones

- **Adherencia Estricta:** Antes de escribir o modificar código, analizaré los archivos circundantes para entender y replicar el estilo existente (formato, nombramiento, etc.).
- **Linting es Obligatorio:** Después de cualquier cambio de código, ejecutaré el comando `npm run lint` para asegurar que se cumplan las reglas de ESLint. Corregiré cualquier error o advertencia que surja.
- **TypeScript:** Se utilizará TypeScript en todo el nuevo código. Se deben definir tipos claros para props, estados y datos de API.

### b. Gestión de Componentes

- **Reutilización:** Fomentaré la creación de componentes reutilizables y modulares.
- **Ubicación:**
  - **Componentes de UI Genéricos:** Se colocarán en `components/ui/`.
  - **Componentes de Página o Compuestos:** Se ubicarán en `app/components/`.
- **Nomenclatura:** Los archivos de componentes seguirán el formato `PascalCase.tsx`.

### c. Manejo de Errores

- **Robustez:** Al añadir nuevas funcionalidades, especialmente aquellas que involucren llamadas a API (Supabase, OpenAI), implementaré un manejo de errores robusto utilizando `try...catch` en funciones asíncronas y estados para reflejar los errores en la UI de manera amigable.

### d. Pruebas (A futuro)

- **Visión:** Aunque actualmente no hay un framework de pruebas configurado, el objetivo es añadir pruebas unitarias y de integración. Propondré la instalación de `jest` y `react-testing-library` cuando sea el momento adecuado para comenzar a escribir pruebas para nuevas funcionalidades críticas.

## 4. Comandos del Proyecto

- **Desarrollo:** `npm run dev` - Inicia el servidor de desarrollo.
- **Build:** `npm run build` - Compila la aplicación para producción.
- **Producción:** `npm run start` - Inicia el servidor de producción.
- **Linting:** `npm run lint` - Analiza el código en busca de errores y problemas de estilo.

## 5. Hoja de Ruta y Funcionalidades Futuras

Esta sección documentará las nuevas funcionalidades que planeamos añadir.

- **Sistema de Blog/Artículos:**
  - Crear modelos en Supabase para los artículos.
  - Desarrollar una sección en el frontend para listar y mostrar artículos.
- **Panel de Administración:**
  - Una sección protegida por contraseña para gestionar proyectos del portafolio, casos de éxito y artículos del blog sin necesidad de tocar el código.
- **Integración Avanzada de IA:**
  - Expandir las `openai-actions` para ofrecer un chatbot de soporte o un generador de ideas de proyectos interactivo.
- **Optimización de Rendimiento:**
  - Analizar y mejorar la velocidad de carga de las imágenes y el rendimiento general del sitio.
