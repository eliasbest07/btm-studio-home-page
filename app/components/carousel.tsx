"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const carouselItems = [
    { id: 1, title: "Imagen 1", image: "https://picsum.photos/800/600?random=1" },
    { id: 2, title: "Imagen 2", image: "https://picsum.photos/800/600?random=2" },
    { id: 3, title: "Imagen 3", image: "https://picsum.photos/800/600?random=3" },
    { id: 4, title: "Imagen 4", image: "https://picsum.photos/800/600?random=4" },
    { id: 5, title: "Imagen 5", image: "https://picsum.photos/800/600?random=5" },
    { id: 6, title: "Imagen 6", image: "https://picsum.photos/800/600?random=6" },
    { id: 7, title: "Imagen 7", image: "https://picsum.photos/800/600?random=7" },
    { id: 8, title: "Imagen 8", image: "https://picsum.photos/800/600?random=8" }
  ];

  const t = useTranslations("Index");

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth >= 768 ? 4 : 2);
      setCurrentIndex(0);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    const maxIndex = carouselItems.length - itemsPerView;
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxIndex = carouselItems.length - itemsPerView;
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 4000);
    return () => clearInterval(interval);
  }, [itemsPerView]);

  const visibleItems = carouselItems.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <div className="w-full mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 p-6">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">{t("title-imageCarousel")}</h2>

        {/* Botones */}
        <button onClick={prevSlide} className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 text-white rounded-full h-12 w-12 flex items-center justify-center">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 text-white rounded-full h-12 w-12 flex items-center justify-center">
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Carrusel */}
        <div className="flex gap-3 h-80">
          <AnimatePresence mode="wait">
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="relative flex-shrink-0 basis-1/4 md:basis-1/4 w-full cursor-pointer"
                onClick={() => setSelectedImage(item.image)}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: index * 0.15
                }}
              >
                <div className="relative h-full rounded-xl overflow-hidden bg-black/20 border border-white/10 shadow-lg hover:scale-105 transition-all duration-300">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ✅ Modal imagen ampliada */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full max-h-[90vh]">
              <motion.img
                src={selectedImage}
                alt="Vista ampliada"
                className="w-full max-h-[85vh] mt-10 object-contain rounded-lg shadow-lg cursor-pointer"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Carousel;