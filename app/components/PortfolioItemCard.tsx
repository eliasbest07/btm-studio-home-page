import Image from "next/image"
import type { PortfolioItem } from "@/app/data/portfolio-data" // Asegúrate que la ruta sea correcta

interface PortfolioItemCardProps {
  item: PortfolioItem
}

export default function PortfolioItemCard({ item }: PortfolioItemCardProps) {
  return (
    <div
      className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105"
      style={{
        // Aplicando un ligero efecto de vidrio, más sutil que las otras tarjetas
        background: "rgba(60, 60, 60, 0.2)", // Un poco más oscuro que el de servicios
        border: "1px solid rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      <Image
        src={item.imageUrl || "/placeholder.svg"}
        alt={item.title}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <h3 className="text-lg font-semibold text-white drop-shadow-md">{item.title}</h3>
        <p className="text-xs text-gray-300 drop-shadow-sm">{item.category}</p>
      </div>
      {/* Fallback por si el hover no funciona o para accesibilidad */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/40 group-hover:hidden md:hidden">
        <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
        <p className="text-xs text-gray-300 truncate">{item.category}</p>
      </div>
    </div>
  )
}
