import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Datos de ejemplo para las imágenes del carrusel
  const carouselItems = [
    {
      id: 1,
      title: "Imagen 1",
      image: "https://picsum.photos/400/300?random=1",
      description: "Descripción de la imagen 1"
    },
    {
      id: 2,
      title: "Imagen 2", 
      image: "https://picsum.photos/400/300?random=2",
      description: "Descripción de la imagen 2"
    },
    {
      id: 3,
      title: "Imagen 3",
      image: "https://picsum.photos/400/300?random=3", 
      description: "Descripción de la imagen 3"
    },
    {
      id: 4,
      title: "Imagen 4",
      image: "https://picsum.photos/400/300?random=4",
      description: "Descripción de la imagen 4"
    },
    {
      id: 5,
      title: "Imagen 5",
      image: "https://picsum.photos/400/300?random=5",
      description: "Descripción de la imagen 5"
    },
    {
      id: 6,
      title: "Imagen 6",
      image: "https://picsum.photos/400/300?random=6",
      description: "Descripción de la imagen 6"
    },
    {
      id: 7,
      title: "Imagen 7",
      image: "https://picsum.photos/400/300?random=7",
      description: "Descripción de la imagen 7"
    },
    {
      id: 8,
      title: "Imagen 8",
      image: "https://picsum.photos/400/300?random=8",
      description: "Descripción de la imagen 8"
    }
  ];

  // Detectar el tamaño de pantalla para responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setItemsPerView(4);
      } else {
        setItemsPerView(2);
      }
      // Reset al cambiar el viewport
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navegación infinita
  const nextSlide = () => {
    setCurrentIndex(prev => {
      const maxIndex = carouselItems.length - itemsPerView;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prev => {
      const maxIndex = carouselItems.length - itemsPerView;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [itemsPerView]); // Dependencia de itemsPerView para reiniciar cuando cambie

  // Calcular el número total de slides posibles
  const totalSlides = Math.max(1, carouselItems.length - itemsPerView + 1);

  return (
    <div className="w-full mx-auto px-4 py-8">
      <div className="relative">
        {/* Contenedor del carrusel */}
        <div className="relative overflow-hidden rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 p-6">
          
          {/* Título */}
          <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
            Nuestro Portafolio
          </h2>

          {/* Controles de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full h-12 w-12 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 rounded-full h-12 w-12 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slides container */}
          <div className="relative h-80">
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full gap-3"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                width: '100%'
              }}
            >
              {carouselItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative flex-shrink-0"
                  style={{ 
                    width: `calc(${100 / itemsPerView}% - 12px)`
                  }}
                >
                  <div className="relative h-full rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                    {/* Imagen */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay con gradiente negro */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    
                    {/* Contenido de texto */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-bold mb-2 drop-shadow-md">{item.title}</h3>
                      <p className="text-sm opacity-90 drop-shadow-sm">{item.description}</p>
                    </div>


                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? "w-8 bg-white" 
                    : "w-2 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          
        </div>

      
      </div>
    </div>
  );
};

export default Carousel;