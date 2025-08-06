"use client";

import Hero from "../components/Hero";
import ImageDisplaySection from "../components/ImageDisplaySection";
import SuccessCasesSection from "../components/SuccessCasesSection";
import { getSuccessCasesData } from "../data/success-cases-data";
import ServiceCard from "../components/ServiceCard";
import { useTranslations } from "next-intl";
import Carousel from "../components/carousel";

export default function HomePage() {
  const dynamicImageUrl = "https://picsum.photos/seed/btmstudio/1280/720";
  const imageAltText = "Paisaje montañoso abstracto generado dinámicamente";
  const t = useTranslations("Index");


  // Obtenemos los servicios desde el archivo de traducción
  const servicesData = t.raw("services") as {
    title: string;
    description: string;
  }[];

  // Construimos los items del carrusel desde las traducciones
  const carouselItems = [1, 2, 3, 4].map((id) => ({
    id,
    title: t(`carousel.${id}.title`),
    description: t(`carousel.${id}.description`),
    image: `/images/carousel-${id}.jpg`,
  }));

  return (
    <>
      <Hero />
      <Carousel/>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-white drop-shadow-md">
            {t("greeting")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 justify-items-center">
            {servicesData.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </section>
      {/* <ImageDisplaySection imageUrl={dynamicImageUrl} altText={imageAltText} title="Nuestra Inspiración Visual" /> */}
      <SuccessCasesSection cases={getSuccessCasesData()} />
    </>
  );
}
