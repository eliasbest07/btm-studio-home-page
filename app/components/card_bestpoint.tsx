"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Star {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  size: number;
  color: string;
}

interface BestPointCardProps {
  value: number;
  variant?: "emerald" | "blue" | "purple" | "amber" | "rose";
  size?: "sm" | "md" | "lg";
  className?: string;
  showSecurityBand?: boolean;
  showGridPattern?: boolean;
  interactive?: boolean;
  onPurchase?: (data: PurchaseData) => void;
}

interface PurchaseData {
  value: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const VARIANTS = {
  emerald: {
    color: "67, 233, 123",
    hex: "#43e97b",
    accent: "emerald-500",
  },
  blue: {
    color: "79, 172, 254", 
    hex: "#4facfe",
    accent: "blue-500",
  },
  purple: {
    color: "168, 85, 247",
    hex: "#a855f7", 
    accent: "purple-500",
  },
  amber: {
    color: "245, 158, 11",
    hex: "#f59e0b",
    accent: "amber-500", 
  },
  rose: {
    color: "240, 147, 251",
    hex: "#f093fb",
    accent: "rose-500",
  },
};

const SIZES = {
  sm: {
    width: "w-64",
    height: "h-40", 
    padding: "p-4",
    logoIcon: "w-6 h-6 text-xs",
    logoText: "text-sm",
    valueText: "text-4xl",
    securityBand: "w-12 h-44 text-[7px]",
  },
  md: {
    width: "w-72",
    height: "h-44",
    padding: "p-5", 
    logoIcon: "w-7 h-7 text-sm",
    logoText: "text-base",
    valueText: "text-5xl",
    securityBand: "w-16 h-52 text-[8px]",
  },
  lg: {
    width: "w-80", 
    height: "h-48",
    padding: "p-6",
    logoIcon: "w-8 h-8 text-base", 
    logoText: "text-lg",
    valueText: "text-6xl",
    securityBand: "w-20 h-56 text-[9px]",
  },
};

export function BestPointCard({
  value,
  variant = "blue",
  size = "md", 
  className,
  showSecurityBand = true,
  showGridPattern = true,
  interactive = true,
  onPurchase,
}: BestPointCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);

  const variantConfig = VARIANTS[variant];
  const sizeConfig = SIZES[size];

  // Funciones del efecto hyperspace
  const initStars = () => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    const stars: Star[] = [];

    // Menos estrellas para el efecto de tarjeta
    for (let i = 0; i < 150; i++) {
      const star: Star = {
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * 500,
        px: 0,
        py: 0,
        size: Math.random() * 1 + 0.3,
        color: `rgba(${parseInt(variantConfig.color.split(',')[0])}, ${parseInt(variantConfig.color.split(',')[1])}, ${parseInt(variantConfig.color.split(',')[2])}, ${0.4 + Math.random() * 0.6})`,
      };
      stars.push(star);
    }

    starsRef.current = stars;
  };

  const drawStars = () => {
    if (!canvasRef.current || !isHovered) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    starsRef.current.forEach((star) => {
      star.z -= 1.5; // Velocidad más lenta para tarjetas

      if (star.z <= 0) {
        star.z = 500;
        star.x = Math.random() * width - centerX;
        star.y = Math.random() * height - centerY;
      }

      const factor = 100 / star.z;
      star.px = star.x * factor + centerX;
      star.py = star.y * factor + centerY;

      const size = Math.min(star.size * (200 / star.z), 3);

      // Trail effect
      const prevFactor = 100 / (star.z + 3);
      const prevX = star.x * prevFactor + centerX;
      const prevY = star.y * prevFactor + centerY;

      const gradient = ctx.createLinearGradient(prevX, prevY, star.px, star.py);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(1, star.color);

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(star.px, star.py);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = size;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(star.px, star.py, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.fill();
    });
  };

  const animate = () => {
    drawStars();
    if (isHovered) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isHovered && canvasRef.current && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
      initStars();
      animate();
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isHovered]);

  const handleCardClick = () => {
    if (interactive && !isFlipped) {
      setIsFlipped(true);
      setIsHovered(false);
    }
  };

  const handleBackClick = () => {
    setIsFlipped(false);
    setFormData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
    });
    setIsProcessing(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    const purchaseData: PurchaseData = {
      value,
      ...formData,
    };

    onPurchase?.(purchaseData);
    
    // Resetear después de compra exitosa
    setTimeout(() => {
      handleBackClick();
    }, 1000);
  };

  const isFormValid = formData.cardNumber.length >= 16 && 
                     formData.expiryDate.length === 5 && 
                     formData.cvv.length >= 3 && 
                     formData.cardholderName.length >= 2;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current || isFlipped) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Respuesta inmediata al mouse
    const rotateX = (y - centerY) / 5;
    const rotateY = (centerX - x) / 5;
    
    // Aplicar transformación 3D inmediata
    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateY(-8px) 
      scale(1.02)
      translateZ(10px)
    `;
    
    // Actualizar posición del mouse para efectos
    const mouseXPercent = (x / rect.width) * 100;
    const mouseYPercent = (y / rect.height) * 100;
    setMousePosition({ x: mouseXPercent, y: mouseYPercent });

    // Actualizar elementos internos con movimiento sutil
    const logoIcon = cardRef.current.querySelector('.logo-icon') as HTMLElement;
    const cardValue = cardRef.current.querySelector('.card-value') as HTMLElement;
    const logoText = cardRef.current.querySelector('.logo-text') as HTMLElement;

    if (logoIcon) {
      logoIcon.style.transform = `translateZ(25px) scale(1.1) translate(${rotateY * 0.5}px, ${rotateX * 0.3}px)`;
    }
    
    if (cardValue) {
      cardValue.style.transform = `translateZ(35px) scale(1.05) translate(${rotateY * 0.3}px, ${rotateX * 0.2}px)`;
    }

    if (logoText) {
      logoText.style.transform = `translateZ(20px) translate(${rotateY * 0.2}px, ${rotateX * 0.1}px)`;
    }
  };

  const handleMouseLeave = () => {
    if (!interactive || !cardRef.current || isFlipped) return;

    setIsHovered(false);
    
    // Retorno suave al estado original
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1) translateZ(0)';
    
    // Resetear elementos internos
    const logoIcon = cardRef.current.querySelector('.logo-icon') as HTMLElement;
    const cardValue = cardRef.current.querySelector('.card-value') as HTMLElement;
    const logoText = cardRef.current.querySelector('.logo-text') as HTMLElement;

    if (logoIcon) {
      logoIcon.style.transform = 'translateZ(20px)';
    }
    
    if (cardValue) {
      cardValue.style.transform = 'translateZ(30px)';
    }

    if (logoText) {
      logoText.style.transform = 'translateZ(15px)';
    }
  };

  const handleMouseEnter = () => {
    if (interactive && !isFlipped) {
      setIsHovered(true);
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative cursor-pointer",
        sizeConfig.width,
        sizeConfig.height,
        "transition-transform duration-100 ease-out",
        "[transform-style:preserve-3d]",
        "[perspective:1000px]",
        className
      )}
      style={{
        // @ts-ignore
        "--card-color": variantConfig.color,
        "--card-hex": variantConfig.hex,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Card Front */}
      <div className={cn(
        "absolute inset-0 w-full h-full rounded-2xl overflow-hidden",
        "[transform-style:preserve-3d] [backface-visibility:hidden]",
        "bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95",
        "shadow-[0_10px_30px_rgba(0,0,0,0.5)] shadow-black/20",
        "before:absolute before:inset-[1px] before:rounded-[inherit]",
        "before:bg-gradient-to-br before:from-white/10 before:to-transparent",
        "hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]",
        `hover:shadow-[${variantConfig.hex}]/20`,
        "transition-transform duration-700 ease-in-out",
        isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
      )}>
        
        {/* Hyperspace Background Effect */}
        <div className={cn(
          "absolute inset-0 rounded-[inherit] overflow-hidden opacity-0 transition-opacity duration-500",
          isHovered && "opacity-100"
        )}>
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>

        {/* Security Band */}
        {showSecurityBand && (
          <div className={cn(
            "absolute -top-5 right-12 opacity-0 transition-opacity duration-300",
            sizeConfig.securityBand,
            "bg-gradient-to-b from-zinc-500/95 via-zinc-300 to-zinc-500/95",
            "[transform:translateZ(25px)_rotateY(15deg)_rotateX(-3deg)]",
            "flex items-center justify-center",
            "[writing-mode:vertical-rl] [text-orientation:mixed]",
            "font-bold tracking-wide text-black/80",
            "shadow-[0_0_20px_rgba(255,255,255,0.3)]",
            "border-l-2 border-r-2 border-white/90",
            "shadow-[inset_2px_0_10px_rgba(255,255,255,0.2),inset_-2px_0_10px_rgba(0,0,0,0.1)]",
            isHovered && "opacity-100"
          )}>
            <div className="[transform:rotate(180deg)] whitespace-nowrap animate-[scroll-vertical_6s_linear_infinite]">
              BestPoint • BestPoint • BestPoint • BestPoint
            </div>
          </div>
        )}

        {/* Holographic Overlay */}
        <div 
          className={cn(
            "absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 pointer-events-none",
            isHovered && "opacity-100"
          )}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(var(--card-color), 0.15) 0%, transparent 50%)`
          }}
        />

        {/* Shine Effect */}
        <div className={cn(
          "absolute inset-0 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100"
        )}>
          <div 
            className="absolute bottom-[55%] left-1/2 w-[200%] aspect-square -translate-x-1/2 rounded-full blur-[30px]"
            style={{
              background: `conic-gradient(from 205deg, transparent 0deg, rgba(var(--card-color), 0.4) 20deg, rgba(var(--card-color), 0.1) 280deg, transparent 360deg)`
            }}
          />
        </div>

        {/* Grid Pattern */}
        {showGridPattern && (
          <div className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-400 overflow-hidden rounded-[inherit]",
            "[mask-image:radial-gradient(circle_at_70%_8%,black_0%,black_15%,transparent_60%)]",
            isHovered && "opacity-100"
          )}>
            {/* Grid lines */}
            <div className={cn(
              "absolute left-0 right-0 h-[1px] top-[10%]",
              "bg-gradient-to-r from-transparent via-[rgba(var(--card-color),0.3)] to-transparent",
              "origin-[0%_50%] scale-x-0 transition-transform duration-400",
              isHovered && "scale-x-100"
            )} style={{ transitionDelay: '0ms' }} />
            <div className={cn(
              "absolute left-0 right-0 h-[1px] top-[32.5%]",
              "bg-gradient-to-r from-transparent via-[rgba(var(--card-color),0.3)] to-transparent", 
              "origin-[0%_50%] scale-x-0 transition-transform duration-400",
              isHovered && "scale-x-100"
            )} style={{ transitionDelay: '100ms' }} />
            <div className={cn(
              "absolute top-0 bottom-0 w-[1px] left-[25%]",
              "bg-gradient-to-b from-transparent via-[rgba(var(--card-color),0.3)] to-transparent",
              "origin-[50%_0%] scale-y-0 transition-transform duration-400", 
              isHovered && "scale-y-100"
            )} style={{ transitionDelay: '200ms' }} />
            <div className={cn(
              "absolute top-0 bottom-0 w-[1px] left-[75%]",
              "bg-gradient-to-b from-transparent via-[rgba(var(--card-color),0.3)] to-transparent",
              "origin-[50%_0%] scale-y-0 transition-transform duration-400",
              isHovered && "scale-y-100" 
            )} style={{ transitionDelay: '300ms' }} />
          </div>
        )}

        {/* Card Content */}
        <div className={cn(
          "relative z-10 h-full flex flex-col justify-between text-white",
          sizeConfig.padding
        )}>
          {/* Logo Section */}
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "logo-icon flex items-center justify-center rounded-lg font-bold text-white",
              "bg-gradient-to-br from-[var(--card-hex)] to-[rgba(var(--card-color),0.8)]",
              "shadow-[0_4px_12px_rgba(var(--card-color),0.4)]",
              "before:absolute before:inset-[1px] before:rounded-[inherit]",
              "before:bg-gradient-to-br before:from-white/20 before:to-transparent",
              "transition-all duration-100",
              "[transform:translateZ(20px)]",
              sizeConfig.logoIcon
            )}>
              B
            </div>
            <div className={cn(
              "logo-text font-semibold text-white transition-all duration-100",
              "[transform:translateZ(15px)]",
              `[text-shadow:0_0_12px_rgba(var(--card-color),0.8),0_2px_4px_rgba(0,0,0,0.5)]`,
              sizeConfig.logoText
            )}>
              BestPoint
            </div>
          </div>

          {/* Card Value */}
          <div className="flex-1 flex items-center justify-center">
            <div className={cn(
              "card-value font-bold text-white leading-none transition-all duration-100",
              "[transform:translateZ(30px)]",
              `[text-shadow:0_0_30px_rgba(var(--card-color),1),0_0_60px_rgba(var(--card-color),0.6),0_4px_12px_rgba(0,0,0,0.8)]`,
              "[filter:drop-shadow(0_8px_16px_rgba(0,0,0,0.5))]",
              sizeConfig.valueText
            )}>
              {value}
            </div>
          </div>

          {/* Click to purchase hint */}
          <div className="text-center">
            <p className="text-xs text-white/60 animate-pulse">
              Click to purchase
            </p>
          </div>
        </div>
      </div>

      {/* Card Back - Purchase Form */}
      <div className={cn(
        "absolute inset-0 w-full h-full rounded-2xl overflow-hidden",
        "[transform-style:preserve-3d] [backface-visibility:hidden]",
        "bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95",
        "shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
        "border border-[var(--card-hex)]/30",
        "transition-transform duration-700 ease-in-out",
        "[transform:rotateY(180deg)]",
        isFlipped ? "[transform:rotateY(0deg)]" : "[transform:rotateY(180deg)]"
      )}>
        <div className={cn(
          "relative z-10 h-full flex flex-col text-white p-4",
          size === "lg" ? "p-6" : size === "sm" ? "p-3" : "p-4"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-6 h-6 bg-gradient-to-br from-[var(--card-hex)] to-[rgba(var(--card-color),0.8)]",
                "rounded-md flex items-center justify-center text-xs font-bold"
              )}>
                B
              </div>
              <span className="text-sm font-semibold">Purchase ${value}</span>
            </div>
            <button 
              onClick={handleBackClick}
              className="text-white/60 hover:text-white transition-colors text-lg"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3">
            {/* Card Number */}
            <div className="space-y-1">
              <label className="text-xs text-white/80">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                maxLength={19}
                className={cn(
                  "w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg",
                  "text-white placeholder-white/40 text-sm",
                  "focus:border-[var(--card-hex)] focus:outline-none",
                  "transition-colors"
                )}
              />
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-white/80">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  maxLength={5}
                  className={cn(
                    "w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg",
                    "text-white placeholder-white/40 text-sm",
                    "focus:border-[var(--card-hex)] focus:outline-none",
                    "transition-colors"
                  )}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/80">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  className={cn(
                    "w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg",
                    "text-white placeholder-white/40 text-sm",
                    "focus:border-[var(--card-hex)] focus:outline-none",
                    "transition-colors"
                  )}
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div className="space-y-1">
              <label className="text-xs text-white/80">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                className={cn(
                  "w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg",
                  "text-white placeholder-white/40 text-sm",
                  "focus:border-[var(--card-hex)] focus:outline-none",
                  "transition-colors"
                )}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isProcessing}
              className={cn(
                "w-full py-2.5 mt-2 rounded-lg font-semibold text-sm",
                "transition-all duration-200",
                isFormValid && !isProcessing
                  ? "bg-[var(--card-hex)] hover:bg-[var(--card-hex)]/80 text-white"
                  : "bg-white/10 text-white/40 cursor-not-allowed",
                isProcessing && "animate-pulse"
              )}
            >
              {isProcessing ? 'Processing...' : `Purchase ${value}`}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-vertical {
          0% {
            transform: rotate(180deg) translateY(-100%);
          }
          100% {
            transform: rotate(180deg) translateY(100%);
          }
        }
      `}</style>
    </div>
  );
}

// Componente adicional para mostrar un grid de cartas
export function BestPointCardGrid({
  values = [15, 20, 50, 200, 500],
  variants = ["blue", "rose", "emerald", "amber", "purple"] as const,
  size = "md",
  className,
  onPurchase,
}: {
  values?: number[];
  variants?: readonly ("emerald" | "blue" | "purple" | "amber" | "rose")[];
  size?: "sm" | "md" | "lg";
  className?: string;
  onPurchase?: (data: PurchaseData) => void;
}) {
  const handlePurchase = (data: PurchaseData) => {
    console.log('Purchase completed:', data);
    onPurchase?.(data);
    
    // Aquí puedes agregar lógica adicional como:
    // - Mostrar notificación de éxito
    // - Enviar datos al servidor
    // - Redirigir a página de confirmación
    alert(`✅ Purchase successful!\nBestPoint Card: ${data.value}\nCard: ${data.cardNumber}\nName: ${data.cardholderName}`);
  };

  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-6",
      "bg-black min-h-screen flex items-center justify-center",
      className
    )}>
      {values.map((value, index) => (
        <BestPointCard
          key={value}
          value={value}
          variant={variants[index % variants.length]}
          size={size}
          onPurchase={handlePurchase}
        />
      ))}
    </div>
  );
}