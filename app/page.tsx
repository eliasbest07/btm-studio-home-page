import Hero from "./components/Hero"
import ImageDisplaySection from "./components/ImageDisplaySection"
import SuccessCasesSection from "./components/SuccessCasesSection"
import { successCasesData } from "./data/success-cases-data"
import ServiceCard from "./components/ServiceCard"

// Datos de servicios traducidos
const servicesData = [
  {
    title: "Desarrollo Web",
    description: "Desarrollo web de alta calidad adaptado a tus necesidades.",
  },
  {
    title: "Desarrollo de Apps",
    description: "Desarrollo de aplicaciones móviles de alta calidad adaptadas a tus necesidades.",
  },
  {
    title: "Diseño UI/UX",
    description: "Diseño UI/UX de alta calidad adaptado a tus necesidades.",
  },
  {
    title: "Branding",
    description: "Servicios de branding de alta calidad adaptados a tus necesidades.",
  },
  {
    title: "Optimización SEO",
    description: "Optimización SEO de alta calidad adaptada a tus necesidades.",
  },
  {
    title: "Marketing Digital",
    description: "Estrategias de marketing digital de alta calidad adaptadas a tus necesidades.",
  },
]

export default function HomePage() {
  const dynamicImageUrl = "https://picsum.photos/seed/btmstudio/1280/720"
  const imageAltText = "Paisaje montañoso abstracto generado dinámicamente"

  return (
    <>
      <Hero />
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-white drop-shadow-md">
            Nuestros Servicios {/* Título traducido */}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 justify-items-center">
            {servicesData.map((service, index) => (
              <ServiceCard key={index} title={service.title} description={service.description} />
            ))}
          </div>
        </div>
      </section>
      <ImageDisplaySection imageUrl={dynamicImageUrl} altText={imageAltText} title="Nuestra Inspiración Visual" />
      <SuccessCasesSection cases={successCasesData} />
    </>
  )
}
