import type React from "react"

interface ServiceCardProps {
  title: string
  description: string
  cardHeight?: number
  cardWidth?: number
  cardColor?: string
  cardOffset?: number
}

export default function ServiceCard({
  title,
  description,
  cardHeight = 200, // Altura por defecto para tarjetas de servicio
  cardWidth = 300, // Ancho por defecto
  cardColor = "rgba(158, 158, 149, 0.2)", // Color de fondo solicitado
  cardOffset = 0,
}: ServiceCardProps) {
  const cardStyle: React.CSSProperties = {
    height: `${cardHeight}px`,
    width: `${cardWidth}px`,
    background: cardColor,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow:
      "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)", // Para compatibilidad con Safari
    borderRadius: "20px",
    marginLeft: `${cardOffset}px`,
    marginTop: `${cardOffset}px`,
    display: "flex",
    flexDirection: "column", // Para apilar título y descripción
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    textAlign: "center",
    color: "#E0E0E0", // Texto claro para contraste
    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Para hover effect
  }

  // Estilos para el hover (se podrían aplicar con clases de Tailwind y @apply si se prefiere)
  // O manejar con estado si se quiere un control más fino con JS
  const hoverStyle: React.CSSProperties = {
    transform: "translateY(-5px) scale(1.03)",
    boxShadow:
      "4px 8px 12px rgba(0, 0, 0, 0.4), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
  }

  // Para aplicar el hover, necesitaríamos un estado o usar :hover con CSS/Tailwind.
  // Por simplicidad con inline styles, el hover se puede añadir con clases de Tailwind si se definen.
  // Aquí lo dejo como referencia, pero la forma más limpia sería con Tailwind.

  return (
    <div
      style={cardStyle}
      className="group hover:translate-y-[-5px] hover:scale-[1.03] hover:shadow-[4px_8px_12px_rgba(0,0,0,0.4),_inset_-1px_0px_2px_rgba(201,201,201,0.1),_inset_5px_-5px_12px_rgba(255,255,255,0.05),_inset_-5px_5px_12px_rgba(255,255,255,0.05)]" // Aplicando hover con Tailwind
    >
      <h3 className="text-xl font-semibold mb-2 text-gray-50">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  )
}
