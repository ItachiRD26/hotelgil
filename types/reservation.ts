export type PaymentStatus = "Parcial" | "Completo";
export type PaymentMethod = "Efectivo" | "Transferencia" | "Tarjeta";

export interface Reservation {
  reservationId: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  startDate: string;
  endDate: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amountPaid: number;
}
