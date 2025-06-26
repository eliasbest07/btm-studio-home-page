// Primero, actualizamos la interfaz para incluir todos los campos necesarios
export interface SuccessCase {
  id: string
  name: string
  description: string
  imageUrl: string
  investment: number
  returnValue: number // Puede ser total o mensual, lo aclararemos con 'returnIsMonthly'
  roiPercentage?: number // Opcional si preferimos mostrar el retorno directo
  details: string
  linkUrl?: string
  linkText?: string
  startYear?: number
  returnIsMonthly?: boolean
  // Nuevo campo para datos de la gráfica de línea (simulada)
  progressData?: Array<{ name: string; value: number }>
}

// Datos simulados para las gráficas de línea
const generateMockProgressData = (baseValue: number, investment: number): Array<{ name: string; value: number }> => {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
  let currentValue = investment * 0.8 // Empezar un poco por debajo de la inversión
  const data = months.map((month, index) => {
    // Simular crecimiento con picos y valles
    const fluctuation = (Math.random() - 0.4) * baseValue * 0.3 // fluctuación más pronunciada
    const growthFactor = 1 + Math.random() * 0.2 + index * 0.05 // Crecimiento gradual
    currentValue = Math.max(0, currentValue * growthFactor + fluctuation)
    if (index === months.length - 1) {
      // Asegurar que el último valor se relacione con el returnValue
      currentValue = baseValue
    }
    return { name: month, value: Math.round(currentValue) }
  })
  // Asegurar que el primer punto sea la inversión para tener un punto de partida claro
  return [
    { name: "Inv.", value: investment },
    ...data.slice(0, -1),
    { name: months[months.length - 1], value: baseValue },
  ]
}

export const successCasesData: SuccessCase[] = [
  {
    id: "repuestos-merida",
    name: "Repuestos Mérida App",
    description: "Aplicación móvil para la búsqueda y cotización de repuestos automotrices.",
    imageUrl: "/images/success-cases/repuestos-merida.webp",
    investment: 500,
    returnValue: 550, // Actualizado según solicitud
    returnIsMonthly: true,
    roiPercentage: 10, // ROI: ((550 - 500) / 500) * 100 = 10%
    details:
      "Desarrollo de una intuitiva aplicación móvil que conecta a clientes con un amplio catálogo de repuestos, agilizando el proceso de compra y generando un notable incremento en ventas desde su lanzamiento.",
    linkUrl: "https://play.google.com/store/apps/details?id=com.btmstudio.rep_merida&hl=en_US",
    linkText: "Ver en Play Store",
    startYear: 2023,
    progressData: generateMockProgressData(550, 500), // returnValue, investment
  },
  {
    id: "repolla", // Reemplazando project-alpha
    name: "Repolla",
    description: "Plataforma de gestión y ventas para Repolla, líder en su sector.",
    imageUrl: "/images/style-inspiration/elegant-luxury.webp", // Placeholder, idealmente una imagen de Repolla
    investment: 4000,
    returnValue: 16000, // Retorno anual
    returnIsMonthly: false,
    roiPercentage: 300, // ROI: ((16000 - 4000) / 4000) * 100 = 300%
    details:
      "Desde 2009, Repolla ha visto un crecimiento sostenido gracias a la optimización de su plataforma digital, resultando en un retorno anual de $16,000 sobre una inversión inicial de $4,000.",
    linkUrl: "#", // Actualizar si hay un link real
    linkText: "Ver Caso de Estudio",
    startYear: 2009,
    progressData: generateMockProgressData(16000, 4000),
  },
  {
    id: "project-beta",
    name: "Logística Global App",
    description: "Desarrollo de aplicación móvil para startup de logística.",
    imageUrl: "/images/style-inspiration/dark-modern-tech.webp",
    investment: 75000,
    returnValue: 300000,
    returnIsMonthly: false,
    roiPercentage: 300,
    details:
      "La app móvil mejoró la eficiencia de las entregas en un 40% y aumentó la satisfacción del cliente en un 25% en los primeros 6 meses.",
    startYear: 2023,
    progressData: generateMockProgressData(300000, 75000),
  },
]
