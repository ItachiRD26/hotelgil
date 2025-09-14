import { db } from "./firebase";
import { ref, push, get, remove, update, child } from "firebase/database";
import { Reservation, PaymentStatus, ReservedRoom } from "./reservation";
import { rooms } from "./room";

// Calcular precio total de habitaciones × noches
function calculateTotal(roomsSelected: ReservedRoom[], checkin: string, checkout: string): number {
  const nights =
    (new Date(checkout).getTime() - new Date(checkin).getTime()) /
    (1000 * 60 * 60 * 24);
  return roomsSelected.reduce((acc, r) => acc + r.price * nights, 0);
}

// Crear reserva
export async function createReservation(data: {
  guestName: string;
  rooms: ReservedRoom[];
  checkinDate: string;
  checkoutDate: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  amountPaid: number;
}) {
  const totalPrice = calculateTotal(data.rooms, data.checkinDate, data.checkoutDate);
  const remaining = totalPrice - data.amountPaid;

  const newRes: Omit<Reservation, "reservationId"> = {
    guestName: data.guestName,
    rooms: data.rooms,
    checkinDate: data.checkinDate,
    checkoutDate: data.checkoutDate,
    paymentStatus: data.paymentStatus,
    paymentMethod: data.paymentMethod,
    amountPaid: data.amountPaid,
    totalPrice,
    remaining,
  };

  await push(ref(db, "reservations"), newRes);
}

// Obtener reservas de un día
export async function getReservationsByDate(date: string): Promise<Reservation[]> {
  const snapshot = await get(ref(db, "reservations"));
  if (!snapshot.exists()) return [];

  const all: { [key: string]: Reservation } = snapshot.val();
  return Object.entries(all)
    .map(([id, r]) => ({ ...r, reservationId: id }))
    .filter(
      (r) =>
        new Date(date) >= new Date(r.checkinDate) &&
        new Date(date) <= new Date(r.checkoutDate)
    );
}

// Eliminar reserva
export async function deleteReservation(reservationId: string) {
  await remove(ref(db, `reservations/${reservationId}`));
}

// Actualizar estado de pago
export async function updatePaymentStatus(reservationId: string, status: PaymentStatus) {
  const snap = await get(child(ref(db), `reservations/${reservationId}`));
  if (!snap.exists()) return;

  const data = snap.val() as Reservation;
  await update(ref(db, `reservations/${reservationId}`), {
    paymentStatus: status,
  });
}

// Obtener resumen mensual
export async function getMonthDayIndex(start: string, end: string) {
  const snapshot = await get(ref(db, "reservations"));
  if (!snapshot.exists()) return [];

  const all: { [key: string]: Reservation } = snapshot.val();
  return Object.entries(all).flatMap(([id, r]) => {
    const arr: any[] = [];
    const current = new Date(r.checkinDate);
    const checkout = new Date(r.checkoutDate);

    while (current <= checkout) {
      const ymd = current.toISOString().split("T")[0];
      arr.push({
        date: ymd,
        reservationId: id,
        guestName: r.guestName,
        roomNumbers: r.rooms.map((rm) => rm.number).join(", "),
        roomTypes: r.rooms.map((rm) => rm.type).join(", "),
        paymentStatus: r.paymentStatus,
        amountPaid: r.amountPaid,
      });
      current.setDate(current.getDate() + 1);
    }
    return arr;
  });

}

// Resumen del mes
export async function getMonthStats(year: number, month: number) {
  const snapshot = await get(ref(db, "reservations"));
  if (!snapshot.exists()) return { total: 0, cobrado: 0, pendiente: 0 };

  const all: { [key: string]: Reservation } = snapshot.val();

  const stats = { total: 0, cobrado: 0, pendiente: 0 };

  Object.values(all).forEach((r) => {
    const checkin = new Date(r.checkinDate);
    if (checkin.getFullYear() === year && checkin.getMonth() === month) {
      stats.total += r.totalPrice;
      stats.cobrado += r.amountPaid;
      stats.pendiente += r.remaining;
    }
  });

  return stats;
}

