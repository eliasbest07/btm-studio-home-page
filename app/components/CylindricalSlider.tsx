"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, User } from 'lucide-react';

const CylindricalSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Glassmorphism style matching your site
    const glassmorphismStyle = {
        background: "rgba(158, 158, 149, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow:
            "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
    };

    // Datos de ejemplo para el slider
    const slides = [
        {
            id: 1,
            name: "María José",
            role: "Desarrolladora Senior",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
            rating: 5,
            location: "Madrid, España",
            description: "Experta en React y desarrollo frontend con 5+ años de experiencia"
        },
        {
            id: 2,
            name: "Carlos Mendez",
            role: "UX/UI Designer",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            rating: 5,
            location: "Barcelona, España",
            description: "Diseñador creativo especializado en experiencias digitales innovadoras"
        },
        {
            id: 3,
            name: "Ana García",
            role: "Product Manager",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
            rating: 4,
            location: "Valencia, España",
            description: "Gestión de productos digitales con enfoque en metodologías ágiles"
        },
        {
            id: 4,
            name: "David López",
            role: "Backend Developer",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
            rating: 5,
            location: "Sevilla, España",
            description: "Arquitecto de sistemas escalables y APIs robustas"
        },
        {
            id: 5,
            name: "Laura Martín",
            role: "Data Scientist",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
            rating: 5,
            location: "Bilbao, España",
            description: "Especialista en machine learning e inteligencia artificial"
        }
    ];

    const totalSlides = slides.length;

    const nextSlide = () => {
        if (isAnimating) return;
     //   setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const prevSlide = () => {
        if (isAnimating) return;
    //    setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
        setTimeout(() => setIsAnimating(false), 500);
    };

    // // Auto-slide cada 4 segundos (pausable)
    // useEffect(() => {
    //     if (isPaused) return;

    //     const interval = setInterval(nextSlide, 4000);
    //     return () => clearInterval(interval);
    // }, [isPaused]);

    const [windowWidth, setWindowWidth] = useState(1024);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getSlideStyle = (index: number) => {
        const angle = ((index - currentIndex) * 360) / totalSlides;
        const radius = windowWidth < 768 ? 120 : windowWidth < 1024 ? 180 : 250; // Responsive radius
        const translateZ = Math.cos((angle * Math.PI) / 180) * radius;
        const rotateY = angle;

        return {
            transform: `translateX(-50%) translateY(-50%) rotateY(${rotateY}deg) translateZ(${radius}px)`,
            opacity: Math.cos((angle * Math.PI) / 180) > -0.5 ? 1 : 0.2,
            zIndex: Math.round(translateZ * 10)
        };
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
            />
        ));
    };

    return (
        <div
            className="w-full h-full mx-auto p-2 sm:p-4 lg:p-6 rounded-xl text-white overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* 3D Slider Container */}
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                <div
                    className="relative w-full h-full flex items-center justify-center"
                    style={{
                        perspective: windowWidth < 768 ? '600px' : windowWidth < 1024 ? '900px' : '1200px',
                        perspectiveOrigin: '50% 50%'
                    }}
                >
                    <div
                        className="relative w-0 h-0 transition-transform duration-500 ease-in-out"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className="absolute w-48 h-56 sm:w-64 sm:h-72 lg:w-72 lg:h-80 transition-all duration-500 ease-in-out"
                                style={getSlideStyle(index)}
                            >
                                <div
                                    className="w-full h-full rounded-lg shadow-xl p-3 sm:p-4 lg:p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300"
                                    style={glassmorphismStyle}
                                >
                                    {/* Avatar */}
                                    <div className="relative mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                                        {slide.image ? (
                                            <img
                                                src={slide.image}
                                                alt={slide.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    if (target.nextSibling) {
                                                        (target.nextSibling as HTMLElement).style.display = 'flex';
                                                    }
                                                }}
                                            />
                                        ) : null}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <User className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white mb-1">
                                        {slide.name}
                                    </h3>

                                    {/* Role */}
                                    <p className="text-xs sm:text-sm lg:text-base text-blue-300 font-medium mb-2 sm:mb-3">
                                        {slide.role}
                                    </p>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2 sm:mb-3">
                                        {renderStars(slide.rating)}
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-1 text-gray-300 mb-2 sm:mb-3">
                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="text-xs sm:text-sm">{slide.location}</span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed overflow-hidden">
                                        <span className="block sm:hidden">
                                            {slide.description.length > 80
                                                ? slide.description.substring(0, 80) + "..."
                                                : slide.description}
                                        </span>
                                        <span className="hidden sm:block">
                                            {slide.description}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Controls */}
                <button
                    onClick={prevSlide}
                    disabled={isAnimating}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
                    style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>

                <button
                    onClick={nextSlide}
                    disabled={isAnimating}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
                    style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
            </div>
        </div>
    );
};

export default CylindricalSlider;