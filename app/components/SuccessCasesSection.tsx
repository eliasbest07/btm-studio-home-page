import SuccessCaseCard from "./SuccessCaseCard"
import type { SuccessCase } from "@/app/data/success-cases-data"
import { useTranslations } from "next-intl"

interface  SuccessCasesSectionProps {
  cases: SuccessCase[]
}

export default function SuccessCasesSection({ cases }: SuccessCasesSectionProps) {
  const t = useTranslations("successCases")
  if (!cases || cases.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-20">
      {" "}
      {/* Eliminado bg-secondary */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-white drop-shadow-md">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 justify-items-center">
          {cases.map((project, index) => (
            <SuccessCaseCard
              key={project.id}
              project={project}
              // Puedes pasar props aquí para variar el tamaño/color/offset si lo deseas
              // cardWidth={350}
              // cardHeight={500}
              // cardColor={index % 2 === 0 ? "rgba(41, 41, 38, 0.7)" : "rgba(50, 50, 45, 0.7)"}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
