"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ShowProjectsModal from "./showProjects"
import { useTranslations } from "next-intl"


export default function Hero() {
  const t = useTranslations("hero")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const carouselItems = [
    {
      id: 1,
      title: t("slide1Title"),
      description: t("slide1Desc"),
      image: "/icon-1.png",
    },
    {
      id: 2,
      title: t("slide2Title"),
      description: t("slide2Desc"),
      image: "/icon-2.png",
    },
    {
      id: 3,
      title: t("slide3Title"),
      description: t("slide3Desc"),
      image: "/icon-3.png",
    },
    {
      id: 4,
      title: t("slide4Title"),
      description: t("slide4Desc"),
      image: "/icon-4.png",
    },
  ]

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselItems.length])

  return (
   
      <section
  className="mt-4 text-white 
             flex flex-col items-center justify-start text-center"
>
  <div className="relative z-10">
    {/* remove default h1 top-margin */}
    <h1 className="mt-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-50 drop-shadow-xl">
      {t("headline")}
    </h1>

    <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg">
      {t("subtext")}
    </p>
  </div>
     <div className="flex flex-col sm:flex-row gap-4 justify-center mb-2">
            <Button size="lg" className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold" onClick={() => setIsModalOpen(true)}>
              {t("ctaContinue")}
            </Button>
            <Button variant="outline" size="lg" className="font-semibold border-gray-200 text-gray-200 bg-transparent hover:bg-white/20 hover:text-white hover:border-white/30">
              <Link href="/estoy-trabajando">{t("ctaPortfolio")}</Link>
            </Button>
        </div>
      <ShowProjectsModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
</section>
   
   
  )
}
