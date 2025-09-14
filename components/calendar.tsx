"use client";

import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import CalendarModal from "./calendar-modal";
import { getMonthDayIndex } from "@/lib/reservations-db";
import { toYMD } from "@/lib/date-utils";
import DashboardStats, { DashboardStatsRef } from "./dashboard-stats";

type CalEvent = { title: string; start: string; allDay: true; color: string };

export default function Calendar() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const statsRef = useRef<DashboardStatsRef>(null);

  const loadRange = async (start: Date, end: Date) => {
    const startY = toYMD(start);
    const endY = toYMD(end);
    const dayIndex = await getMonthDayIndex(startY, endY);

    const evs: CalEvent[] = dayIndex.map((d) => ({
      title: `${d.guestName} – Hab(s): ${d.roomNumbers}`,
      start: d.date,
      allDay: true,
      color: d.paymentStatus === "pagado" ? "#22c55e" : "#eab308",
    }));
    setEvents(evs);
  };

  const handleDatesChange = (start: Date, end: Date) => {
    loadRange(start, end);
    statsRef.current?.refresh(start); // 👈 le pasamos el mes actual visible
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      {/* Dashboard stats dinámico */}
      <DashboardStats ref={statsRef} />

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={(info) => {
          setSelectedDate(info.dateStr);
          setIsModalOpen(true);
        }}
        height="80vh"
        locale={esLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        datesSet={(arg) => handleDatesChange(arg.start, arg.end)}
      />

      {isModalOpen && (
        <CalendarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          onDataChange={() =>
            handleDatesChange(
              new Date(),
              new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            )
          }
        />
      )}
    </div>
  );
}
