import { Room } from "./room";

export type PaymentStatus = "parcial" | "pagado";
export type PaymentMethod = "Efectivo" | "Transferencia" | "Tarjeta";

export interface Reservation {
  reservationId: string;
  guestName: string;
  rooms: Room[];
  checkinDate: string;   // YYYY-MM-DD
  checkoutDate: string;  // YYYY-MM-DD
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amountPaid: number;
}
