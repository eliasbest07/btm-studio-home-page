"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ShowProjectsModal from "./showProjects"
import Image from "next/image"
import { Car, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import Carousel from "./carousel"

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
    <>
      <section className="relative text-white min-h-[calc(100vh-4rem-80px)] md:min-h-[calc(100vh-4rem-120px)] flex items-center justify-center text-center py-2 px-4">
        <div className="relative z-10">

        <Carousel/>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-50 drop-shadow-xl">
            {t("headline")}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            {t("subtext")}
          </p>
        </div>
        
      </section>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-2">
            <Button size="lg" className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold" onClick={() => setIsModalOpen(true)}>
              {t("ctaContinue")}
            </Button>
            <Button variant="outline" size="lg" className="font-semibold border-gray-200 text-gray-200 bg-transparent hover:bg-white/20 hover:text-white hover:border-white/30">
              <Link href="/portfolio">{t("ctaPortfolio")}</Link>
            </Button>
        </div>
      <ShowProjectsModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
