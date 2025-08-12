"use client";
import React from "react";
import clsx from "clsx";

export type WeeklyEvent = {
  id: string;
  title: string;
  dayIndex: number;      // 0 = Monday
  startHour: number;     // 24h
  endHour?: number;
  color?: string;        // Tailwind bg-* e.g. "bg-blue-500"
};

type Props = {
  weekStart?: Date;
  startHour?: number;    // default 7
  endHour?: number;      // default 21
  days?: number;         // default 7
  events?: WeeklyEvent[];
  onCellClick?: (dayIndex: number, hour: number) => void;
  renderEvent?: (ev: WeeklyEvent) => React.ReactNode;
  className?: string;
};

const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

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
  background: "rgba(25,25,25,0.55)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
};
/* ==================== */

export function WeeklyCalendar({
  weekStart = getMonday(new Date()),
  startHour = 7,
  endHour = 21,
  days = 7,
  events = [],
  onCellClick,
  renderEvent,
  className,
}: Props) {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  const cols = Array.from({ length: days }, (_, i) => i);

  const eventsBySlot = (dayIndex: number, hour: number) =>
    events.filter((e) => e.dayIndex === dayIndex && e.startHour === hour);

  return (
    <div className={clsx("w-full rounded-lg bg-transparent", className)}>
      {/* Header row */}
     {/* Header row (sticky) */}
<div
  className="sticky top-0 z-20 grid border-b border-white/10"
  style={{
    ...headerStickyStyle,
    gridTemplateColumns: `120px repeat(${days}, minmax(0,1fr))`,
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
        className="grid"
        style={{
          gridTemplateColumns: `120px repeat(${days}, minmax(0, 1fr))`,
        }}
      >
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
              >
                <div className="space-y-1 ">
                  {eventsBySlot(d, h).map((ev) => (
                    <div
                      key={ev.id}
                      className={clsx(
                        "text-xs rounded-md px-2 py-1 leading-tight shadow-sm",
                        ev.color ?? "bg-blue-500",
                        (ev.color ?? "bg-blue-500").includes("yellow")
                          ? "text-black"
                          : "text-white"
                      )}
                      title={`${ev.title} — ${formatHour(ev.startHour)}${
                        ev.endHour ? `–${formatHour(ev.endHour)}` : ""
                      }`}
                    >
                      {renderEvent ? (
                        renderEvent(ev)
                      ) : (
                        <div className="font-medium truncate">{ev.title}</div>
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
  );
}

/* Helpers */
function getMonday(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0=Mon … 6=Sun
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default WeeklyCalendar;
