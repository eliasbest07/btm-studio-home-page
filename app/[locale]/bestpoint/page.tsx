"use client"

import { BestPointCard } from "@/app/components/card_bestpoint"

export default function BestPointPage() {
  const cardData = [
    { value: 15, variant: "blue" as const },
    { value: 20, variant: "emerald" as const },
    { value: 50, variant: "amber" as const },
    { value: 200, variant: "purple" as const },
    { value: 500, variant: "rose" as const },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {/* Grid responsive con layout hexagonal en pantallas grandes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:hexagonal-grid gap-6 lg:gap-8 xl:gap-12 justify-items-center items-center">
          {cardData.map((card, index) => (
            <div 
              key={card.value}
              className={`${index >= 3 ? 'xl:col-start-2 xl:col-span-1' : ''} ${index === 3 ? '2xl:hexagonal-item-4' : ''} ${index === 4 ? '2xl:hexagonal-item-5' : ''} transition-all duration-300`}
            >
              <BestPointCard
                value={card.value}
                variant={card.variant}
                size="md"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 1536px) {
          .hexagonal-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, auto);
            gap: 2rem;
            justify-items: center;
            align-items: center;
            max-width: 900px;
            margin: 0 auto;
          }
          
          .hexagonal-grid > div:nth-child(1) {
            grid-column: 2;
            grid-row: 1;
          }
          
          .hexagonal-grid > div:nth-child(2) {
            grid-column: 1;
            grid-row: 2;
            transform: translateY(-50px);
          }
          
          .hexagonal-grid > div:nth-child(3) {
            grid-column: 3;
            grid-row: 2;
            transform: translateY(-50px);
          }
          
          .hexagonal-grid > div:nth-child(4) {
            grid-column: 1;
            grid-row: 3;
            transform: translateY(-100px);
          }
          
          .hexagonal-grid > div:nth-child(5) {
            grid-column: 3;
            grid-row: 3;
            transform: translateY(-100px);
          }
        }
        
        @media (min-width: 1280px) and (max-width: 1535px) {
          .xl\\:grid-cols-3 > div:nth-child(4),
          .xl\\:grid-cols-3 > div:nth-child(5) {
            grid-column: 2;
          }
        }
      `}</style>
    </div>
  )
}