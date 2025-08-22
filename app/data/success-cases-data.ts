import { useTranslations } from "next-intl"

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
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
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


export function getSuccessCasesData(): SuccessCase[] {
  const t = useTranslations("successCases")

  return [
    {
      id: "repuestos-merida",
      name: t("repuestos-merida.name"),
      description: t("repuestos-merida.description"),
      details: t("repuestos-merida.details"),
      linkText: t("repuestos-merida.linkText"),
      imageUrl: "/images/success-cases/repuestos-merida.webp",
      investment: 500,
      returnValue: 550,
      returnIsMonthly: true,
      roiPercentage: 10,
      linkUrl: "https://play.google.com/store/apps/details?id=com.btmstudio.rep_merida&hl=en_US",
      startYear: 2023,
      progressData: generateMockProgressData(550, 500),
    },
    {
      id: "repolla",
      name: t("repolla.name"),
      description: t("repolla.description"),
      details: t("repolla.details"),
      linkText: t("repolla.linkText"),
      imageUrl: "/images/success-cases/repolla_520.png",
      investment: 4000,
      returnValue: 16000,
      returnIsMonthly: false,
      roiPercentage: 300,
      linkUrl: "https://play.google.com/store/apps/datasafety?id=com.natillera.repolla",
      startYear: 2009,
      progressData: generateMockProgressData(16000, 4000),
    },
    {
      id: "project-beta",
      name: t("project-beta.name"),
      description: t("project-beta.description"),
      details: t("project-beta.details"),
      linkText: t("project-beta.linkText"),
      imageUrl: "/images/success-cases/total-time_logo.png",
      investment: 50,
      returnValue: 5000,
      returnIsMonthly: false,
      roiPercentage: 300,
      linkUrl: "https://total-time.app",
      startYear: 2023,
      progressData: generateMockProgressData(300000, 75000),
    },
  ]
}
