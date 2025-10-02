"use client";

import { useState } from "react";
import { Reservation, PaymentStatus} from "@/types/reservation";
import { updateReservation, deleteReservation } from "@/lib/reservations-db";
import Toast from "./toast";
import { toLocalDMY } from "@/utils/date";

interface ReservationDetailModalProps {
  reservation: Reservation;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ReservationDetailModal({
  reservation,
  onClose,
  onUpdated,
}: ReservationDetailModalProps) {
  const [checkin, setCheckin] = useState(reservation.checkinDate);
  const [checkout, setCheckout] = useState(reservation.checkoutDate);
  const [amountPaid, setAmountPaid] = useState(reservation.amountPaid || 0);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  // Calcular noches y total
  const nights = Math.max(
    (new Date(checkout).getTime() - new Date(checkin).getTime()) /
      (1000 * 60 * 60 * 24),
    1
  );

  const total = reservation.rooms.reduce(
    (sum, room) => sum + room.price * nights,
    0
  );

  const pendiente = Math.max(total - amountPaid, 0);
  const estado: PaymentStatus =
    amountPaid >= total ? "pagado" : amountPaid > 0 ? "parcial" : "pendiente";

  // ✅ Guardar fechas
  const handleUpdateDates = async () => {
    await updateReservation(reservation.reservationId, {
      checkinDate: checkin,
      checkoutDate: checkout,
    });
    setToastMsg("Fechas actualizadas ✅");
    onUpdated();
  };

  // ✅ Guardar pago
  const handleUpdatePayment = async (
    newAmountPaid: number,
    newStatus: PaymentStatus
  ) => {
    await updateReservation(reservation.reservationId, {
      amountPaid: newAmountPaid,
      paymentStatus: newStatus,
    });
    setAmountPaid(newAmountPaid);
    setToastMsg("Pago actualizado ✅");
    onUpdated();
  };

  // ✅ Eliminar
  const handleDelete = async () => {
    await deleteReservation(reservation.reservationId);
    setToastMsg("Reserva eliminada ❌");
    onUpdated();
    onClose();
  };

  if (!reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="mb-4 text-xl font-bold">Detalle de Reserva</h2>

        <p className="mb-2">
          <span className="font-semibold">Huésped:</span>{" "}
          {reservation.guestName}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Habitaciones:</span>{" "}
          {reservation.rooms.map((room) => room.roomNumber).join(", ")}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Check-in:</span>{" "}
          {toLocalDMY(reservation.checkinDate)}
        </p>
        <p className="mb-4">
          <span className="font-semibold">Check-out:</span>{" "}
          {toLocalDMY(reservation.checkoutDate)}
        </p>

        {/* Bloque de pagos */}
        <div className="border rounded p-3 mb-4">
          <p className="font-semibold">
            Total ({nights} noche(s)): RD${total.toLocaleString()}
          </p>

          <div className="flex items-center gap-2 mt-2">
<input
  type="number"
  className="flex-1 rounded border p-2"
  placeholder="Monto pagado"
  value={amountPaid === 0 ? "" : amountPaid}
  disabled={!isEditingAmount}
  onChange={(e) => {
    const val = Number(e.target.value) || 0;
    setAmountPaid(val > total ? total : val);
  }}
/>

            <button
              className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => setIsEditingAmount((prev) => !prev)}
              title="Editar monto manualmente"
            >
              ✏️
            </button>
          </div>

          <p className="mt-2">
            Pendiente:{" "}
            <span className="text-red-600 font-semibold">
              RD${pendiente.toLocaleString()}
            </span>
          </p>

          <p>
            Estado actual:{" "}
            {estado === "pagado" ? (
              <span className="text-green-600 font-semibold">Pagado</span>
            ) : estado === "parcial" ? (
              <span className="text-yellow-600 font-semibold">Parcial</span>
            ) : (
              <span className="text-red-600 font-semibold">Pendiente</span>
            )}
          </p>

          {/* Botón completar pago */}
          {amountPaid < total && (
            <button
              onClick={() => handleUpdatePayment(total, "pagado")}
              className="mt-3 w-full bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
            >
              Completar Pago
            </button>
          )}
        </div>

        <p className="mt-2">
          <span className="font-semibold">Método de pago:</span>{" "}
          {reservation.paymentMethod}
        </p>

        {/* Gestión */}
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-semibold mb-2">Gestión de estancia</h4>

          <label className="block text-xs text-gray-500">Check-in</label>
          <input
            type="date"
            className="w-full border rounded p-2 mb-2"
            value={checkin}
            min={today}
            onChange={(e) => setCheckin(e.target.value)}
          />

          <label className="block text-xs text-gray-500">Check-out</label>
          <input
            type="date"
            className="w-full border rounded p-2 mb-4"
            value={checkout}
            min={today}
            onChange={(e) => setCheckout(e.target.value)}
          />

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleUpdateDates}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar fechas
            </button>

            <button
              onClick={() => handleUpdatePayment(amountPaid, estado)}
              className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Actualizar pago
            </button>

            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      {toastMsg && (
        <Toast message={toastMsg} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
}
