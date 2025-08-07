"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

/* ---------- Image card with placeholder ---------- */
const CarouselImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-black/20 border border-white/10">
      <img
        src="/placeholder.png"
        alt="placeholder"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
    </div>
  );
};

/* ------------------------- Carousel ------------------------- */
const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const carouselItems = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: `Imagen ${i + 1}`,
    image: `https://picsum.photos/800/600?random=${i + 1}`,
  }));

  const t = useTranslations("Index");

  /* responsive slides per view */
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth >= 768 ? 4 : 2);
      setCurrentIndex(0);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* auto-advance every 4 s */
  useEffect(() => {
    const id = setInterval(() => nextSlide(), 4000);
    return () => clearInterval(id);
  }, [itemsPerView]);

  const maxIndex = carouselItems.length - itemsPerView;
  const nextSlide = () => setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1));
  const prevSlide = () => setCurrentIndex((i) => (i <= 0 ? maxIndex : i - 1));

  const visible = carouselItems.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  return (
    <div className="w-full px-4 py-2">
      <div className="relative overflow-hidden rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 p-6">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {t("title-imageCarousel")}
        </h2>

        {/* nav buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white rounded-full h-12 w-12 flex items-center justify-center"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white rounded-full h-12 w-12 flex items-center justify-center"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* slides */}
        <div className="flex gap-3 h-80">
          <AnimatePresence mode="wait">
            {visible.map((item, idx) => (
              <motion.div
                key={item.id}
                className="shrink-0 grow-0 basis-1/2 md:basis-1/4 cursor-pointer"
                onClick={() => setSelectedImage(item.image)}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 18,
                  delay: idx * 0.15, // stagger
                }}
              >
                <CarouselImage src={item.image} alt={item.title} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* full-screen image */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-start justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage}
              alt="Zoomed"
              className="max-w-5xl w-full max-h-[85vh] mt-16 object-contain rounded-lg shadow-lg"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Carousel;
