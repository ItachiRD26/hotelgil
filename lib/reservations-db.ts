import { db } from "@/lib/firebase"
import { ref, get, set, update, remove } from "firebase/database"
import type { Reservation } from "@/types/reservation"
import type { Room } from "@/types/room" // 👈 ahora importamos desde room.ts
import { v4 as uuidv4 } from "uuid"

// Crear una reserva
export async function createReservation(reservation: Omit<Reservation, "reservationId">) {
  const reservationId = uuidv4()
  const reservationRef = ref(db, `reservations/${reservationId}`)
  await set(reservationRef, { ...reservation, reservationId })
  return reservationId
}

// Obtener reservas por fecha (YYYY-MM-DD)
export async function getReservationsByDate(date: string): Promise<Reservation[]> {
  const snapshot = await get(ref(db, "reservations"))
  if (!snapshot.exists()) return []

  const data = snapshot.val()
  return Object.values(data).filter((r: unknown) => {
    const reservation = r as Reservation
    return reservation.checkinDate <= date && reservation.checkoutDate >= date
  }) as Reservation[]
}

// Obtener índice de días entre checkin y checkout
export async function getMonthDayIndex(from: string, to: string) {
  const snapshot = await get(ref(db, "reservations"))
  if (!snapshot.exists()) return []

  const data = snapshot.val()
  const results: {
    date: string
    guestName: string
    roomNumbers: string[]
    paymentStatus: string
    amountPaid: number
  }[] = []

  Object.values(data).forEach((r: unknown) => {
    const res: Reservation = r as Reservation
    const startDate = new Date(from)
    const end = new Date(to)
    const d = new Date(startDate)

    while (d <= end) {
      const dStr = d.toISOString().split("T")[0]
      if (res.checkinDate <= dStr && res.checkoutDate >= dStr) {
        results.push({
          date: dStr,
          guestName: res.guestName,
          roomNumbers: res.rooms.map((room: Room) => room.roomNumber),
          paymentStatus: res.paymentStatus,
          amountPaid: res.amountPaid,
        })
      }
      d.setDate(d.getDate() + 1)
    }
  })

  return results
}

// Actualizar una reserva
export async function updateReservation(reservationId: string, updates: Partial<Reservation>) {
  const reservationRef = ref(db, `reservations/${reservationId}`)
  await update(reservationRef, updates)
}

// Eliminar una reserva
export async function deleteReservation(reservationId: string) {
  const reservationRef = ref(db, `reservations/${reservationId}`)
  await remove(reservationRef)
}

export async function getMonthStats(year: number, month: number) {
  const snapshot = await get(ref(db, "reservations"))
  if (!snapshot.exists()) {
    return { total: 0, cobrado: 0, pendiente: 0 }
  }

  const data = snapshot.val()
  let total = 0
  let cobrado = 0
  let pendiente = 0

  // Rango del mes que se está calculando
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0) // último día del mes

  Object.values(data).forEach((r: unknown) => {
    const reservation = r as Reservation
    const checkin = new Date(reservation.checkinDate)
    const checkout = new Date(reservation.checkoutDate)

    // Determinar intersección entre la reserva y el mes actual
    const start = checkin < monthStart ? monthStart : checkin
    const end = checkout > monthEnd ? monthEnd : checkout

    if (end < monthStart || start > monthEnd) {
      // No cae dentro del mes
      return
    }

    // Noches que caen dentro de este mes
    const nights = Math.max((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24), 1)

    const monto = reservation.rooms.reduce((sum: number, room: Room) => sum + (room.price || 0) * nights, 0)

    total += monto

    if (reservation.paymentStatus === "pagado") {
      cobrado += monto
    } else {
      const pago = reservation.amountPaid || 0
      cobrado += pago > monto ? monto : pago
      pendiente += monto - (pago > monto ? monto : pago)
    }
  })

  return { total, cobrado, pendiente }
}
