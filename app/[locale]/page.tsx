"use client";

import Hero from "../components/Hero";

import SuccessCasesSection from "../components/SuccessCasesSection";
import { getSuccessCasesData } from "../data/success-cases-data";
import ServiceCard from "../components/ServiceCard";
import { useTranslations } from "next-intl";
import Carousel from "../components/carousel";
import WeeklyGlobalEvent from "../components/calendario_main";


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
      <Carousel/>
      <Hero />
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-white drop-shadow-md">
            {t("greeting")}
          </h2>
          <section className="mb-12 flex justify-center">
            <div 
              className="group hover:translate-y-[-5px] hover:scale-[1.03] hover:shadow-[4px_8px_12px_rgba(0,0,0,0.4),_inset_-1px_0px_2px_rgba(201,201,201,0.1),_inset_5px_-5px_12px_rgba(255,255,255,0.05),_inset_-5px_5px_12px_rgba(255,255,255,0.05)]"
              style={{
                width: "100%",
                maxWidth: "1200px",
                height: "600px",
                background: "rgba(158, 158, 149, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                borderRadius: "20px",
                padding: "20px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                overflow: "visible"
              }}
            >
              <div style={{ height: "100%", width: "100%" }}>
                <WeeklyGlobalEvent/>
              </div>
            </div>
          </section>
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
