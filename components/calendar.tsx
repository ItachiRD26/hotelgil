"use client"

import { useState, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from "@fullcalendar/core/locales/es"
import CalendarModal from "./calendar-modal"
import { getMonthDayIndex } from "@/lib/reservations-db"
import { toYMD } from "@/lib/date-utils"
import DashboardStats, { type DashboardStatsRef } from "./dashboard-stats"

type CalEvent = { title: string; start: string; allDay: true; color: string }

interface DayReservation {
  guestName?: string;
  date: string;
  paymentStatus?: string;
  roomNumbers?: string[];
  rooms?: { roomNumber: string }[];
}

interface DatesSetArg {
  start: Date
  end: Date
  view: {
    currentStart?: Date
  }
}

export default function Calendar() {
  const [events, setEvents] = useState<CalEvent[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("")

  const statsRef = useRef<DashboardStatsRef>(null)
  const lastDatesArgRef = useRef<DatesSetArg | null>(null)

  const loadRange = async (start: Date, end: Date) => {
    const startY = toYMD(start)
    const endY = toYMD(end)
    const dayIndex = await getMonthDayIndex(startY, endY)

    const evs: CalEvent[] = dayIndex.map((d: DayReservation) => {
      // 🔹 fallback por si roomNumbers no existe
      const roomNumbers =
        d.roomNumbers || (d.rooms ? d.rooms.map((r: { roomNumber: string }) => r.roomNumber) : [])

      return {
        title: `${d.guestName || "Sin nombre"} – Hab(s): ${roomNumbers.join(", ")}`,
        start: d.date,
        allDay: true,
        color: d.paymentStatus === "pagado" ? "#22c55e" : "#eab308",
      }
    })

    setEvents(evs)
  }

  // ✅ Siempre refrescamos stats con el PRIMER DÍA DEL MES VISIBLE
  const handleDatesChange = (arg: DatesSetArg) => {
    const { start, end, view } = arg
    loadRange(start, end)

    // En month view, currentStart es el 1er día del mes; start puede ser fin del mes anterior
    const base: Date = view?.currentStart ?? start
    const firstOfMonth = new Date(base.getFullYear(), base.getMonth(), 1)
    statsRef.current?.refresh(firstOfMonth)
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      <DashboardStats ref={statsRef} />

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={(info) => {
          setSelectedDate(info.dateStr)
          setIsModalOpen(true)
        }}
        height="80vh"
        locale={esLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        datesSet={(arg) => {
          lastDatesArgRef.current = arg // guardamos el último rango visible
          handleDatesChange(arg)
        }}
      />

      {isModalOpen && (
        <CalendarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          onDataChange={() => {
            // 🔹 Recargamos eventos del calendario
            if (lastDatesArgRef.current) {
              handleDatesChange(lastDatesArgRef.current)
            }

            // 🔹 Refrescamos estadísticas
            const now = new Date()
            const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            statsRef.current?.refresh(firstOfMonth)
          }}
        />
      )}
    </div>
  )
}
