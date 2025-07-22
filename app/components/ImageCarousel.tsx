"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import useEmblaCarousel, { type EmblaOptionsType, type EmblaCarouselType } from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface CarouselImageItem {
  src: string
  alt: string
  prompt: string // Añadido para el prompt descriptivo
}

interface ImageCarouselProps {
  items: CarouselImageItem[] // Cambiado de images: string[] a items: CarouselImageItem[]
  options?: EmblaOptionsType
  onImageSelect?: (item: CarouselImageItem, index: number) => void // Pasa el item completo
  className?: string
  itemsToShow?: number
}

const defaultOptions: EmblaOptionsType = {
  align: "start",
  containScroll: "trimSnaps",
}

export default function ImageCarousel({
  items,
  options: userOptions,
  onImageSelect,
  className,
  itemsToShow = 4,
}: ImageCarouselProps) {
  const options = { ...defaultOptions, ...userOptions }
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const handleImageClick = (item: CarouselImageItem, index: number) => {
    if(index != -1){
      setSelectedIndex(index)

    }else{
      
    }
    if (onImageSelect) {
      onImageSelect(item, index)
    }
  }

  const onEmblaSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onEmblaSelect(emblaApi)
    emblaApi.on("reInit", onEmblaSelect)
    emblaApi.on("select", onEmblaSelect)
  }, [emblaApi, onEmblaSelect])

  if (!items || items.length === 0) {
    return <p className="text-center text-gray-400">No hay imágenes para mostrar.</p>
  }

  const slideBaseWidth = `${100 / itemsToShow}%`

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex -ml-2">
          {items.map((item, index) => (
            <div
              className="relative pl-2 group"
              style={{ flex: `0 0 ${slideBaseWidth}` }}
              key={item.src + index} // Usar src + index para key más robusta
              onClick={() => handleImageClick(item, index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleImageClick(item, index)}
            >
              <div
                className={cn(
                  "relative aspect-[4/3] w-full overflow-hidden rounded-md transition-all duration-200 ease-in-out cursor-pointer",
                  selectedIndex === index
                    ? "ring-2 ring-offset-2 ring-offset-gray-800 ring-gray-100 scale-105"
                    : "group-hover:opacity-80",
                )}
              >
                <Image src={item.src || "/placeholder.svg"} alt={item.alt} layout="fill" objectFit="cover" />
                {selectedIndex === index && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
                    <span className="text-white font-semibold text-xs text-center">Seleccionado</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > itemsToShow && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-black/50 hover:bg-black/70 border-white/30 text-white rounded-full"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            aria-label="Imágenes anteriores"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-black/50 hover:bg-black/70 border-white/30 text-white rounded-full"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            aria-label="Siguientes imágenes"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  )
}
