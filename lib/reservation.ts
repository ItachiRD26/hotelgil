export type ReservedRoom = {
  number: string;
  type: "Sencilla" | "Doble";
  price: number;
};

export type PaymentStatus = "parcial" | "pagado";

export type Reservation = {
  reservationId: string;
  guestName: string;
  rooms: ReservedRoom[];   // 👈 ahora soporta varias habitaciones
  checkinDate: string;
  checkoutDate: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  amountPaid: number;
  totalPrice: number;
  remaining: number;
};