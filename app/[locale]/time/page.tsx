"use client";
import WeeklyCalendar, { WeeklyEvent } from "@/components/personalizado-calendario";

const events: WeeklyEvent[] = [
  { id: "1", title: "Team sync", dayIndex: 0, startHour: 9, endHour: 10, color: "bg-green-500" },
];

export default function Page() {
  return (
     <main>

<div >
    <div className="background blue-purple"></div>
    <div className="background green-blue"></div>
    
    <div>
            <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
    
    </div >  
 
    
            
  </div>
     
    <div 
      className="h-[600px] overflow-y-auto rounded-lg border border-gray-200 mr-4 ml-4 mt-4 shadow-sm custom-scrollbar"
      style={{
        /* Estilos personalizados del scrollbar */
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
      }}
    >
      {/* Estilos CSS para WebKit browsers */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 18px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          transition: background-color 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
      
      <WeeklyCalendar />
    </div>
    <div>
      
    </div>
    </main>
  );
}
