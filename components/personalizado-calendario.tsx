"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";

export type WeeklyEvent = {
  id: string;
  title: string;
  subtitle?: string;
  dayIndex: number;      // 0 = Monday, -1 = unscheduled
  startHour: number;     // 24h
  endHour?: number;
  color?: string;        // Tailwind bg-* e.g. "bg-blue-500"
  time?: string;         // Display time for mobile view
};

type Props = {
  weekStart?: Date;
  startHour?: number;    // default 7
  endHour?: number;      // default 21
  days?: number;         // default 7
  events?: WeeklyEvent[];
  onEventMove?: (eventId: string, dayIndex: number, hour?: number) => void;
  onEventRemove?: (eventId: string) => void;
  onCellClick?: (dayIndex: number, hour: number) => void;
  renderEvent?: (ev: WeeklyEvent) => React.ReactNode;
  className?: string;
};

const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const dayNamesFull = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

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

const cardOffset = 6;

const hourCardStyle: React.CSSProperties = {
  background: "rgba(158, 158, 149, 0.2)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow:
    "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  borderRadius: "20px",
  marginTop: `${cardOffset}px`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  textAlign: "center",
  color: "#000000ff",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const headerStickyStyle: React.CSSProperties = {
  background: "rgba(25,25,25,0.95)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

const unscheduledStickyStyle: React.CSSProperties = {
  background: "rgba(50,50,50,0.95)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};

/* Helpers */
function getMonday(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0=Mon … 6=Sun
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getColorClasses(color?: string): string {
  if (!color) return "bg-blue-500 text-white";
  
  // Handle text color based on background
  if (color.includes("yellow") || color.includes("lime") || color.includes("amber")) {
    return `${color} text-black`;
  }
  return `${color} text-white`;
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
  renderEvent,
  className,
}: Props) {
  const [draggedEvent, setDraggedEvent] = useState<WeeklyEvent | null>(null);
  const [isDraggingFromCalendar, setIsDraggingFromCalendar] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const cols = Array.from({ length: days }, (_, i) => i);

  // Check if current time should show the indicator
  const todayIndex = isDateInWeek(currentTime, weekStart, days);
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const showTimeIndicator = todayIndex >= 0 && currentHour >= startHour && currentHour <= endHour;
  
  // Calculate position of time indicator (percentage from top of current hour)
  const timeIndicatorPosition = showTimeIndicator 
    ? ((currentHour - startHour) + (currentMinutes / 60)) / (endHour - startHour + 1) * 100
    : 0;

  // Get unscheduled events (dayIndex === -1)
  const unscheduledEvents = events.filter(e => e.dayIndex === -1);
  
  // Get scheduled events for a specific slot
  const eventsBySlot = (dayIndex: number, hour: number) =>
    events.filter((e) => e.dayIndex === dayIndex && e.startHour === hour);

  // Get all events for a specific day (mobile view)
  const getEventsForDay = (dayIndex: number) =>
    events.filter((e) => e.dayIndex === dayIndex).sort((a, b) => a.startHour - b.startHour);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, event: WeeklyEvent, fromCalendar: boolean) => {
    setDraggedEvent(event);
    setIsDraggingFromCalendar(fromCalendar);
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
    setIsDraggingFromCalendar(false);
  };

  const handleEventDoubleClick = (eventId: string) => {
    if (onEventRemove) {
      onEventRemove(eventId);
    }
  };

  // Mobile day data
  const mobileDays = cols.map(idx => {
    const date = getLabelDate(weekStart, idx);
    const dayDate = new Date(weekStart);
    dayDate.setDate(dayDate.getDate() + idx);
    
    return {
      key: idx,
      name: dayNamesFull[idx],
      shortName: dayNames[idx],
      date,
      isToday: todayIndex === idx
    };
  });

  // Calculate sticky header height for desktop
  const stickyHeaderHeight = unscheduledEvents.length > 0 ? 160 : 80; // Approximate heights

  return (
    <div className={clsx("w-full", className)}>
       <div className="hidden lg:block rounded-lg bg-transparent relative">
        
        {/* Unscheduled events tray - Sticky at top */}
        {unscheduledEvents.length > 0 && (
          <div 
            className="sticky top-0 z-30 p-3 border-b border-gray-200"
            style={{
              ...unscheduledStickyStyle,
            }}
          >
            <div className="text-sm font-medium text-white mb-2">Tareas sin programar:</div>
            <div className="flex flex-wrap gap-2">
              {unscheduledEvents.map((ev) => (
                <div
                  key={ev.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, ev, false)}
                  className={clsx(
                    "px-3 py-2 rounded-md text-sm cursor-move shadow-sm hover:shadow-md transition-shadow",
                    getColorClasses(ev.color)
                  )}
                >
                  <div className="font-medium">{ev.title}</div>
                  {ev.subtitle && <div className="text-xs opacity-75">{ev.subtitle}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Header row (sticky) - Below unscheduled tasks */}
        <div
          className="sticky z-20  grid border-b border-white/10"
          style={{
            ...headerStickyStyle,
            gridTemplateColumns: `120px repeat(${days}, minmax(0,1fr))`,
            top: unscheduledEvents.length > 0 ? '105px' : '0px', // Adjust based on unscheduled tasks presence
          }}
        >
          {/* top-left spacer */}
          <div className="p-2">
            <div className="w-full h-14" />
          </div>

          {cols.map((d) => (
            <div key={d} className="px-2 flex items-center justify-center">
              <div style={headerCardStyle} className="w-full text-center">
                <span className="text-[11px] font-medium text-white/80">
                  {dayNames[d] ?? `Day ${d + 1}`}
                </span>
                <span className="text-xl leading-none font-semibold text-white mt-1">
                  {getLabelDate(weekStart, d)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div
          className="grid relative"
          style={{
            gridTemplateColumns: `120px repeat(${days}, minmax(0, 1fr))`,
          }}
        >
          {/* Time indicator line - Desktop */}
          {showTimeIndicator && (
            <div 
              className="absolute left-0 right-0 z-10 pointer-events-none"
              style={{
                top: `${timeIndicatorPosition}%`,
                transform: 'translateY(-1px)'
              }}
            >
              <div className="flex items-center">
                <div className="w-[120px] pr-2 flex justify-end">
                  <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex-1 h-0.5 bg-red-500 shadow-sm" />
              </div>
            </div>
          )}

          {hours.map((h) => (
            <React.Fragment key={h}>
              {/* hour gutter with glass card */}
              <div className="p-2">
                <div style={hourCardStyle} className="w-full h-16 font-medium text-sm">
                  {formatHour(h)}
                </div>
              </div>

              {/* day cells */}
              {cols.map((d) => (
                <div
                  key={`${d}-${h}`}
                  className="h-18 border-l border-gray-100 p-1 relative hover:bg-gray-50 cursor-pointer"
                  onClick={() => onCellClick?.(d, h)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, d, h)}
                >
                  <div className="space-y-1">
                    {eventsBySlot(d, h).map((ev) => (
                      <div
                        key={ev.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, ev, true)}
                        onDoubleClick={() => handleEventDoubleClick(ev.id)}
                        className={clsx(
                          "text-xs rounded-md px-2 py-1 leading-tight shadow-sm cursor-move hover:opacity-80",
                          getColorClasses(ev.color)
                        )}
                        title={`${ev.title} — ${formatHour(ev.startHour)}${
                          ev.endHour ? `–${formatHour(ev.endHour)}` : ""
                        } (Doble click para desprogramar)`}
                      >
                        {renderEvent ? (
                          renderEvent(ev)
                        ) : (
                          <>
                            <div className="font-medium truncate">{ev.title}</div>
                            {ev.subtitle && <div className="text-xs opacity-75 truncate">{ev.subtitle}</div>}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-30 bg-gray-600 text-white p-3 rounded-t-lg text-center text-sm font-medium">
          Semana: {getWeekRange(weekStart, days)}
        </div>
        
        {/* Unscheduled tasks - Sticky for mobile */}
        {unscheduledEvents.length > 0 && (
          <div className="sticky bg-white top-[44px] z-20  p-3 border-x border-gray-300">
            <div className="text-xs font-medium text-gray-700 mb-2">Tareas sin programar:</div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {unscheduledEvents.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, t, false)}
                  className={clsx(
                    "min-w-[120px] p-2 rounded text-xs cursor-move flex-shrink-0",
                    getColorClasses(t.color)
                  )}
                >
                  <div className="font-medium">{t.title}</div>
                  {t.subtitle && <div className="opacity-75">{t.subtitle}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border border-gray-300 rounded-b-lg overflow-hidden relative">
          {mobileDays.map((d) => (
            <div key={d.key} className="border-b border-gray-300 last:border-b-0">
              <div className="flex relative">
                <div className="w-16 bg-gray-100 border-r border-gray-300 flex flex-col items-center justify-center py-4">
                  <div className="text-xs text-gray-600 font-medium">
                    {d.shortName.toLowerCase()}
                  </div>
                  <div
                    className={clsx(
                      "text-sm font-bold mt-1",
                      d.isToday
                        ? "bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        : "text-gray-800"
                    )}
                  >
                    {d.date}
                  </div>
                </div>
                <div
                  className="flex-1 p-2 min-h-[80px] flex flex-wrap content-start gap-1 relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, d.key)}
                >
                  {/* Vertical time indicator for current day in mobile */}
                  {d.isToday && showTimeIndicator && (
                    <div 
                      className="absolute top-0 bottom-0 z-10 pointer-events-none"
                      style={{
                        left: `${((currentHour - startHour) + (currentMinutes / 60)) / (endHour - startHour + 1) * 100}%`,
                        transform: 'translateX(-1px)'
                      }}
                    >
                      <div className="flex flex-col items-center h-full">
                        <div className="bg-red-500 text-white text-[10px] px-1 py-0.5 rounded-b-full font-medium whitespace-nowrap">
                          {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex-1 w-0.5 bg-red-500 shadow-sm" />
                      </div>
                    </div>
                  )}
                  
                  {getEventsForDay(d.key).map((t) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, t, true)}
                      onDoubleClick={() => handleEventDoubleClick(t.id)}
                      className={clsx(
                        "px-2 py-1 rounded text-xs cursor-move hover:opacity-80",
                        getColorClasses(t.color)
                      )}
                      title="Arrastra para mover o doble click para remover"
                    >
                      <div className="font-medium">{t.time || formatHour(t.startHour)}</div>
                      <div className="opacity-90">{t.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
}

// Example usage component
export default function CalendarExample() {
  const [events, setEvents] = useState<WeeklyEvent[]>([
    { id: "1", title: "Reunión equipo", subtitle: "Zoom", dayIndex: -1, startHour: 9, color: "bg-blue-500" },
    { id: "2", title: "Presentación", subtitle: "Cliente A", dayIndex: -1, startHour: 10, color: "bg-green-500" },
    { id: "3", title: "Almuerzo", dayIndex: 1, startHour: 12, time: "12:00", color: "bg-yellow-500" },
    { id: "4", title: "Código review", dayIndex: 2, startHour: 14, time: "2:00 PM", color: "bg-purple-500" },
    { id: "5", title: "Planning", subtitle: "Sprint 24", dayIndex: -1, startHour: 11, color: "bg-red-500" },
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
    <div className="min-h-screen p-4">
      <WeeklyCalendar
        events={events}
        onEventMove={handleEventMove}
        onEventRemove={handleEventRemove}
        onCellClick={handleCellClick}
        startHour={7}
        endHour={24}
      />
    </div>
  );
}