"use client";
import WeeklyCalendar, { WeeklyEvent } from "@/components/personalizado-calendario";
//import { CalendarDays } from "lucide-react";
//import { WeeklyCalendar, type WeeklyEvent } from "./components/personalizado-calendario";


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
     
    <div className="h-[600px] overflow-y-auto rounded-lg border border-gray-200 mr-4 ml-4 mt-4 shadow-sm">
     
      <WeeklyCalendar
        startHour={7}
        endHour={21}
        events={events}
        onCellClick={(day: any, hour: any) => console.log({ day, hour })}
      />
    </div>
    </main>
  );
}
