import { portfolioData } from "@/app/data/portfolio-data" // Ajusta la ruta si es necesario
import PortfolioItemCard from "@/app/components/PortfolioItemCard" // Ajusta la ruta si es necesario
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portafolio - BTM Studio",
  description: "Explora nuestros proyectos y casos de éxito en BTM Studio.",
}

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-xl">Nuestro Portafolio</h1>
        <p className="text-lg text-gray-300 mt-3 max-w-2xl mx-auto drop-shadow-lg">
          Una muestra de los proyectos innovadores y soluciones creativas que hemos entregado.
        </p>
      </header>

      {portfolioData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {portfolioData.map((item) => (
            <PortfolioItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-xl">Nuestro portafolio se está actualizando. ¡Vuelve pronto!</p>
      )}
    </div>
  )
}
