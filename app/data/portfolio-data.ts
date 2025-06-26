export interface PortfolioItem {
  id: string
  title: string
  imageUrl: string
  category: string
  description?: string // Opcional
}

export const portfolioData: PortfolioItem[] = [
  {
    id: "portfolio-1",
    title: "Repuestos Mérida App",
    imageUrl: "/images/success-cases/repuestos-merida.webp", // Reutilizando la imagen del caso de éxito
    category: "Aplicación Móvil",
    description: "Aplicación intuitiva para la búsqueda y cotización de repuestos automotrices.",
  },
  {
    id: "portfolio-2",
    title: "Talonario.com.co",
    imageUrl: "/images/style-inspiration/minimalist-neutral.webp",
    category: "Diseño Web",
    description: "Sitio web de uso fácil y elegante para la creacion y gestocion de rifas y de vendedores.",
  },
  {
    id: "portfolio-3",
    title: "Plataforma Tech Moderna",
    imageUrl: "/images/style-inspiration/dark-modern-tech.webp",
    category: "Desarrollo Web",
    description: "Interfaz innovadora para una startup tecnológica en modo oscuro.",
  },
  {
    id: "portfolio-4",
    title: "Marca Juguetona y Vibrante",
    imageUrl: "/images/style-inspiration/vibrant-playful.webp",
    category: "Branding",
    description: "Identidad visual y sitio web para una marca con energía y atractivo juvenil.",
  },
  {
    id: "portfolio-5",
    title: "E-commerce de Lujo",
    imageUrl: "/images/style-inspiration/elegant-luxury.webp",
    category: "E-commerce",
    description: "Tienda online sofisticada para productos de alta gama.",
  },
  {
    id: "portfolio-6",
    title: "Web Eco-Consciente",
    imageUrl: "/images/style-inspiration/eco-natural.webp",
    category: "Diseño Web",
    description: "Presencia online para una marca comprometida con la sostenibilidad.",
  },
  {
    id: "portfolio-7",
    title: "Portal Retro-Futurista",
    imageUrl: "/images/style-inspiration/retro-futuristic.webp",
    category: "Desarrollo Web",
    description: "Experiencia web nostálgica con una estética synthwave de los 80.",
  },
  {
    id: "portfolio-8",
    title: "Consultoría Financiera Pro",
    imageUrl: "/placeholder.svg?width=600&height=450", // Placeholder
    category: "Diseño Web",
    description: "Sitio web profesional para una consultora financiera, enfocado en la confianza.",
  },
]
