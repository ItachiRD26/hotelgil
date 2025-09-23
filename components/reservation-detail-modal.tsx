"use client";

import { useState } from "react";
import { Reservation } from "@/types/reservation";
import {
  updateReservation,
  deleteReservation,
} from "@/lib/reservations-db";
import Toast from "./toast";
import { normalizeDate } from "@/utils/date";

interface Props {
  reservation: Reservation;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ReservationDetailModal({
  reservation,
  onClose,
  onUpdated,
}: Props) {
  const [checkin, setCheckin] = useState(reservation.checkinDate || "");
  const [checkout, setCheckout] = useState(reservation.checkoutDate || "");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const originalPartialAmount = reservation.amountPaid || 0;
  const today = new Date().toISOString().split("T")[0];

  const handleDelete = async () => {
    await deleteReservation(reservation.reservationId);
    setToastMsg("Reserva eliminada ✅");
    onUpdated();
    onClose();
  };

  const handleUpdateCheckinCheckout = async () => {
    await updateReservation(reservation.reservationId, {
      checkinDate: normalizeDate(checkin),
      checkoutDate: normalizeDate(checkout),
    });
    setToastMsg("Fechas actualizadas ✅");
    onUpdated();
    onClose();
  };

  const handleMarkPaid = async () => {
    await updateReservation(reservation.reservationId, {
      paymentStatus: "pagado",
    });
    setToastMsg("Reserva marcada como pagada ✅");
    onUpdated();
    onClose();
  };

  const handleRevertToPartial = async () => {
    await updateReservation(reservation.reservationId, {
      paymentStatus: "parcial",
      amountPaid: originalPartialAmount,
    });
    setToastMsg("Reserva revertida a parcial ✅");
    onUpdated();
    onClose();
  };

  // Calcular noches
  const nights =
    checkout && checkin
      ? Math.max(
          (new Date(checkout).getTime() - new Date(checkin).getTime()) /
            (1000 * 60 * 60 * 24),
          1
        )
      : 1;

  const total = reservation.rooms.reduce(
    (s, r) => s + r.price * nights,
    0
  );
  const pagado =
    reservation.paymentStatus === "pagado"
      ? total
      : reservation.amountPaid || 0;
  const restante = Math.max(total - pagado, 0);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-400/70 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Detalle de reserva</h2>

        <p>
          <span className="font-semibold">Huésped:</span>{" "}
          {reservation.guestName}
        </p>
        <p>
          <span className="font-semibold">Habitaciones:</span>{" "}
          {reservation.rooms.map((r) => r.roomNumber).join(", ")}
        </p>

        <div className="mt-3 p-3 border rounded-lg bg-gray-50">
          <p>
            <span className="font-semibold">Total ({nights} noche(s)):</span>{" "}
            RD${total.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Pagado:</span>{" "}
            <span className="text-green-600 font-semibold">
              RD${pagado.toLocaleString()}
            </span>
          </p>
          <p>
            <span className="font-semibold">Restante:</span>{" "}
            <span className="text-red-600 font-semibold">
              RD${restante.toLocaleString()}
            </span>
          </p>
        </div>

        <p className="mt-2">
          <span className="font-semibold">Estado de pago:</span>{" "}
          {reservation.paymentStatus === "pagado" ? (
            <span className="text-green-600 font-semibold">Pagado</span>
          ) : (
            <span className="text-yellow-600 font-semibold">
              Parcial (RD${reservation.amountPaid})
            </span>
          )}
        </p>
        <p>
          <span className="font-semibold">Método de pago:</span>{" "}
          {reservation.paymentMethod}
        </p>

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
              onClick={handleUpdateCheckinCheckout}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar cambios
            </button>

            {reservation.paymentStatus !== "pagado" && (
              <button
                onClick={handleMarkPaid}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Marcar como pagado
              </button>
            )}

            {reservation.paymentStatus === "pagado" && (
              <button
                onClick={handleRevertToPartial}
                className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Revertir a parcial
              </button>
            )}

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
