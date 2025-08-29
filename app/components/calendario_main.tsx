"use client";
import React, { useState, useEffect } from "react";
import CylindricalSlider from "./CylindricalSlider";

export type WeeklyGlobalEvent = {
  id: string;
  title: string;
  subtitle?: string;
  dayIndex: number;      // 0 = Monday, -1 = unscheduled
  startHour: number;     // 24h
  endHour?: number;
  color?: string;        // CSS background color
  time?: string;         // Display time for mobile view
};

type Props = {
  weekStart?: Date;
  startHour?: number;    // default 7
  endHour?: number;      // default 21
  days?: number;         // default 7
  events?: WeeklyGlobalEvent[];
  onEventMove?: (eventId: string, dayIndex: number, hour?: number) => void;
  onEventRemove?: (eventId: string) => void;
  onCellClick?: (dayIndex: number, hour: number) => void;
  className?: string;
};

const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const dayNamesFull = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function getLabelDate(weekStart: Date, idx: number) {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + idx);
  return d.getDate();
}

function formatHour(h: number) {
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  if (h > 12) return `${h - 12} PM`;
  return `${h} AM`;
}

function getWeekRange(weekStart: Date, days: number) {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(end.getDate() + days - 1);

  const startMonth = monthNames[start.getMonth()];
  const endMonth = monthNames[end.getMonth()];
  const startDate = start.getDate();
  const endDate = end.getDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDate} - ${endDate}`;
  }
  return `${startMonth} ${startDate} - ${endMonth} ${endDate}`;
}

/* === Glass styles === */
const headerCardStyle: React.CSSProperties = {
  background: "rgba(41, 41, 38, 0.8)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow:
    "2px 4px 4px rgba(0,0,0,0.35), inset -1px 0px 2px rgba(201,201,201,0.1), inset 5px -5px 12px rgba(255,255,255,0.05), inset -5px 5px 12px rgba(255,255,255,0.05)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  borderRadius: "20px",
  padding: "15px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};



const headerStickyStyle: React.CSSProperties = {
  background: "rgba(25,25,25,0.95)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};



/* Helpers */
function getMonday(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0=Mon … 6=Sun
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Helper to check if today is within the current week
function isDateInWeek(date: Date, weekStart: Date, days: number): number {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + days);

  if (date >= weekStart && date < weekEnd) {
    const dayDiff = Math.floor((date.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
    return dayDiff;
  }
  return -1;
}

export function WeeklyCalendar({
  weekStart = getMonday(new Date()),
  startHour = 7,
  endHour = 21,
  days = 7,
  events = [],
  onEventMove,
  onEventRemove,
  onCellClick,
  className,
}: Props) {
  const [draggedEvent, setDraggedEvent] = useState<WeeklyGlobalEvent | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const cols = Array.from({ length: days }, (_, i) => i);

  // Check if current time should show the indicator
  const todayIndex = isDateInWeek(currentTime, weekStart, days);

  // Get all events for a specific day (mobile view)
  const getEventsForDay = (dayIndex: number) =>
    events.filter((e) => e.dayIndex === dayIndex).sort((a, b) => a.startHour - b.startHour);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, event: WeeklyGlobalEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number, hour?: number) => {
    e.preventDefault();
    if (draggedEvent && onEventMove) {
      onEventMove(draggedEvent.id, dayIndex, hour);
    }
    setDraggedEvent(null);
  };

  const handleEventDoubleClick = (eventId: string) => {
    if (onEventRemove) {
      onEventRemove(eventId);
    }
  };

  // Mobile day data
  const mobileDays = cols.map(idx => {
    const date = getLabelDate(weekStart, idx);
    return {
      key: idx,
      name: dayNamesFull[idx],
      shortName: dayNames[idx],
      date,
      isToday: todayIndex === idx
    };
  });

  return (
    <div className={`w-full h-auto ${className || ''} overflow-hidden`} style={{
      background: 'transparent',
      height: 'auto'
    }}>
      {/* Desktop View */}
      <div className="hidden lg:flex flex-col h-full rounded-lg bg-transparent relative overflow-hidden">

        {/* Navigation Header */}
        <div className="flex-shrink-0 p-3 mb-2" style={{
          background: 'rgba(158, 158, 149, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(6px)',
          borderRadius: '15px'
        }}>
          <div className="text-center">
            <h1 className="text-lg font-bold text-white mb-1">Actividades de la Semana</h1>
            <p className="text-sm text-white/80">{getWeekRange(weekStart, days)}</p>
          </div>
        </div>

        {/* CylindricalSlider Container - Responsive height */}
        <div className="flex-shrink-0 h-80 sm:h-96 lg:h-[500px] overflow-visible mb-4">
          <CylindricalSlider />
        </div>

        {/* Header row (sticky) */}
        <div
          className="flex-shrink-0 z-20 grid border-b border-white/10"
          style={{
            ...headerStickyStyle,
            gridTemplateColumns: `repeat(${days}, minmax(0,1fr))`,
          }}
        >
          {cols.map((d) => (
            <div key={d} className="px-2 flex items-center justify-center">
              <div style={headerCardStyle} className="w-full text-center">
                <span className="text-[11px] font-medium text-white/80">
                  {dayNames[d]}
                </span>
                <span className="text-xl leading-none font-semibold text-white mt-1">
                  {getLabelDate(weekStart, d)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Grid - Solo días sin horas */}
        <div
          className="flex-1 grid relative overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))`,
          }}
        >
          {cols.map((d) => (
            <div
              key={d}
              className="border-l border-gray-100 relative hover:bg-white/5 cursor-pointer h-full flex flex-col"
              onClick={() => onCellClick?.(d, 0)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, d)}
            >
              <div className="p-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <div className="space-y-2">
                  {getEventsForDay(d).map((ev) => (
                    <div
                      key={ev.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ev)}
                      onDoubleClick={() => handleEventDoubleClick(ev.id)}
                      className="text-sm rounded-md px-3 py-2 shadow-sm cursor-move hover:opacity-80 text-white flex-shrink-0"
                      style={{ background: ev.color || 'rgba(59, 130, 246, 0.8)' }}
                      title={`${ev.title}${ev.subtitle ? ` - ${ev.subtitle}` : ''}`}
                    >
                      <div className="font-medium">{ev.title}</div>
                      {ev.subtitle && <div className="text-xs opacity-75">{ev.subtitle}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm text-white p-3 rounded-t-lg text-center text-sm font-medium border border-white/20">
          Semana: {getWeekRange(weekStart, days)}
        </div>

        {/* CylindricalSlider Container - Mobile */}
        <div className="flex-shrink-0 h-80 overflow-visible mb-3">
          <CylindricalSlider />
        </div>

        {/* Calendar Days */}
        <div className="flex-1 border border-white/20 border-t-0 rounded-b-lg overflow-hidden bg-white/5 backdrop-blur-sm">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {mobileDays.map((d) => (
              <div key={d.key} className="border-b border-white/10 last:border-b-0">
                <div className="flex relative min-h-[80px] max-h-[120px]">
                  <div className="w-16 bg-white/10 border-r border-white/10 flex flex-col items-center justify-center py-2 flex-shrink-0">
                    <div className="text-xs text-white/70 font-medium">
                      {d.shortName.toLowerCase()}
                    </div>
                    <div
                      className={`text-sm font-bold mt-1 ${d.isToday
                        ? "bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        : "text-white"
                        }`}
                    >
                      {d.date}
                    </div>
                  </div>
                  <div
                    className="flex-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, d.key)}
                  >
                    <div className="flex flex-col gap-1">
                      {getEventsForDay(d.key).map((t) => (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, t)}
                          onDoubleClick={() => handleEventDoubleClick(t.id)}
                          className="px-2 py-1 rounded text-xs cursor-move hover:opacity-80 text-white flex-shrink-0"
                          style={{ background: t.color || 'rgba(59, 130, 246, 0.8)' }}
                          title="Arrastra para mover o doble click para remover"
                        >
                          <div className="font-medium truncate">{t.title}</div>
                          {t.subtitle && <div className="text-xs opacity-75 truncate">{t.subtitle}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Example usage component
export default function CalendarExample() {
  const [events, setEvents] = useState<WeeklyGlobalEvent[]>([
    { id: "1", title: "Reunión equipo", subtitle: "Zoom", dayIndex: -1, startHour: 9, color: "rgba(59, 130, 246, 0.8)" },
    { id: "2", title: "Presentación", subtitle: "Cliente A", dayIndex: -1, startHour: 10, color: "rgba(16, 185, 129, 0.8)" },
    { id: "3", title: "Almuerzo", dayIndex: 1, startHour: 12, time: "12:00", color: "rgba(245, 158, 11, 0.8)" },
    { id: "4", title: "Código review", dayIndex: 2, startHour: 14, time: "2:00 PM", color: "rgba(147, 51, 234, 0.8)" },
    { id: "5", title: "Planning", subtitle: "Sprint 24", dayIndex: -1, startHour: 11, color: "rgba(239, 68, 68, 0.8)" },
    { id: "6", title: "Cita médica", dayIndex: 4, startHour: 15, time: "3:00 PM", color: "rgba(236, 72, 153, 0.8)" },
  ]);

  const handleEventMove = (eventId: string, dayIndex: number, hour?: number) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          dayIndex,
          startHour: hour ?? e.startHour,
          time: hour ? formatHour(hour) : e.time
        };
      }
      return e;
    }));
  };

  const handleEventRemove = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, dayIndex: -1 };
      }
      return e;
    }));
  };

  const handleCellClick = (dayIndex: number, hour: number) => {
    console.log(`Clicked cell: Day ${dayIndex}, Hour ${hour}`);
  };

  return (
   
      <WeeklyCalendar
        events={events}
        onEventMove={handleEventMove}
        onEventRemove={handleEventRemove}
        onCellClick={handleCellClick}
        startHour={7}
        endHour={22}
      />

  );
}