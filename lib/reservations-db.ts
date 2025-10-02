import { db } from "@/lib/firebase"
import { ref, get, set, update, remove } from "firebase/database"
import type { Reservation } from "@/types/reservation"
import { v4 as uuidv4 } from "uuid"

// 🔹 Tipos auxiliares
export interface RoomDB {
  roomNumber: string
  roomType: string
  price: number
}

// Aceptamos también "pendiente" porque Firebase puede guardar ese estado
export type PaymentStatus = "pagado" | "parcial" | "pendiente"

// 🔹 Crear una reserva
export async function createReservation(
  reservation: Omit<Reservation, "reservationId">
): Promise<string> {
  const reservationId = uuidv4()
  const reservationRef = ref(db, `reservations/${reservationId}`)
  await set(reservationRef, { ...reservation, reservationId })
  return reservationId
}

// 🔹 Obtener reservas por fecha (YYYY-MM-DD)
export async function getReservationsByDate(date: string): Promise<Reservation[]> {
  const snapshot = await get(ref(db, "reservations"))
  if (!snapshot.exists()) return []

  const data = snapshot.val()
  return Object.values(data).filter((r: unknown): r is Reservation => {
    if (!r || typeof r !== "object") return false
    const reservation = r as Reservation
    return reservation.checkinDate <= date && reservation.checkoutDate >= date
  })
}

// 🔹 Estructura de los días en el índice mensual
export interface DayIndex {
  date: string
  guestName?: string
  paymentStatus?: PaymentStatus
  roomNumbers: string[]
}

// 🔹 Obtener índice de reservas por rango de fechas
export async function getMonthDayIndex(start: string, end: string): Promise<DayIndex[]> {
  const snapshot = await get(ref(db, "reservations"))
  if (!snapshot.exists()) return []

  const reservations: Reservation[] = Object.values(snapshot.val()) as Reservation[]

  const result: DayIndex[] = []
  for (const r of reservations) {
    const checkin = new Date(r.checkinDate)
    const checkout = new Date(r.checkoutDate)

    for (let d = new Date(checkin); d <= checkout; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      if (dateStr >= start && dateStr <= end) {
        result.push({
          date: dateStr,
          guestName: r.guestName,
          paymentStatus: r.paymentStatus,
          roomNumbers: r.rooms?.map((room) => room.roomNumber) || [],
        })
      }
    }
  }

  return result
}

// 🔹 Actualizar una reserva
export async function updateReservation(
  reservationId: string,
  updates: Partial<Reservation>
): Promise<void> {
  const reservationRef = ref(db, `reservations/${reservationId}`)
  await update(reservationRef, updates)
}

// 🔹 Eliminar una reserva
export async function deleteReservation(reservationId: string): Promise<void> {
  const reservationRef = ref(db, `reservations/${reservationId}`)
  await remove(reservationRef)
}

// 🔹 getMonthStats robusto
export async function getMonthStats(
  year: number,
  month: number
): Promise<{ total: number; cobrado: number; pendiente: number }> {
  const snapshot = await get(ref(db, "reservations"))
  if (!snapshot.exists()) return { total: 0, cobrado: 0, pendiente: 0 }

  const values = snapshot.val()
  // ✅ usamos `!!r` para forzar boolean y evitar error de "unknown not assignable to boolean"
  const reservations: Reservation[] = Object.values(values).filter(
    (r): r is Reservation => !!r && typeof r === "object"
  )

  let total = 0
  let cobrado = 0
  let pendiente = 0

  // Helper: parsea YYYY-MM-DD de forma segura
  const parseYMD = (s: unknown) => {
    if (typeof s !== "string") return null
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
    if (!m) return null
    const y = parseInt(m[1], 10)
    const mo = parseInt(m[2], 10)
    const d = parseInt(m[3], 10)
    return { y, mo, d, date: new Date(y, mo - 1, d) }
  }

  for (const r of reservations) {
    const inP = parseYMD(r?.checkinDate)
    const outP = parseYMD(r?.checkoutDate)
    if (!inP || !outP) continue

    // Filtrado por mes
    if (inP.y !== year || inP.mo - 1 !== month) continue

    const ms = outP.date.getTime() - inP.date.getTime()
    const nights = Math.max(Math.round(ms / (1000 * 60 * 60 * 24)), 1)

    const rooms: RoomDB[] = Array.isArray(r?.rooms) ? (r.rooms as RoomDB[]) : []
    const totalRooms = rooms.reduce((sum, room) => {
      const price =
        typeof room?.price === "number" ? room.price : Number(room?.price) || 0
      return sum + price * nights
    }, 0)

    total += totalRooms

    if (r?.paymentStatus === "pagado") {
      cobrado += totalRooms
    } else {
      const paid =
        typeof r?.amountPaid === "number" ? r.amountPaid : Number(r?.amountPaid) || 0
      cobrado += paid
      pendiente += Math.max(totalRooms - paid, 0)
    }
  }

  return { total, cobrado, pendiente }
}
