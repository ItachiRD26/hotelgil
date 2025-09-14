"use client";

import { useEffect, useState } from "react";
import { rooms } from "@/lib/room";
import {
  createReservation,
  getReservationsByDate,
  deleteReservation,
  updatePaymentStatus,
} from "@/lib/reservations-db";
import { PaymentStatus, Reservation, ReservedRoom } from "@/lib/reservation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onDataChange: () => void;
};

export default function CalendarModal({ isOpen, onClose, selectedDate, onDataChange }: Props) {
  const [guestName, setGuestName] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("parcial");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [selectedRooms, setSelectedRooms] = useState<ReservedRoom[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (selectedDate) loadReservations();
  }, [selectedDate]);

  const loadReservations = async () => {
    const res = await getReservationsByDate(selectedDate);
    setReservations(res);
  };

  const addRoom = () => {
    setSelectedRooms([...selectedRooms, { number: "", type: "Sencilla", price: 2500 }]);
  };

  const updateRoom = (index: number, number: string) => {
    const roomInfo = rooms.find((r) => r.number === number);
    if (!roomInfo) return;
    const updated = [...selectedRooms];
    updated[index] = { number: roomInfo.number, type: roomInfo.type, price: roomInfo.price };
    setSelectedRooms(updated);
  };

  const handleSave = async () => {
    if (!guestName || !checkoutDate || selectedRooms.length === 0) return;

    await createReservation({
      guestName,
      rooms: selectedRooms,
      checkinDate: selectedDate,
      checkoutDate,
      paymentStatus,
      paymentMethod,
      amountPaid,
    });

    onDataChange();
    await loadReservations();
    onClose(); // 👈 cerrar modal después de guardar
  };

  const handleDelete = async (id: string) => {
    await deleteReservation(id);
    onDataChange();
    await loadReservations();
  };

  const handleTogglePayment = async (id: string, status: PaymentStatus) => {
    const newStatus = status === "parcial" ? "pagado" : "parcial";
    await updatePaymentStatus(id, newStatus);
    onDataChange();
    await loadReservations();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-[900px] max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Reservas — {selectedDate}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Formulario nueva reserva */}
          <div>
            <h3 className="text-md font-semibold mb-3">Nueva reserva</h3>

            <input
              className="w-full border rounded p-2 mb-2"
              placeholder="Nombre del cliente"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />

            {selectedRooms.map((room, i) => (
              <select
                key={i}
                className="w-full border rounded p-2 mb-2"
                value={room.number}
                onChange={(e) => updateRoom(i, e.target.value)}
              >
                <option value="">Seleccione habitación</option>
                {rooms.map((r) => (
                  <option key={r.number} value={r.number}>
                    Hab. {r.number} — {r.type} (RD${r.price})
                  </option>
                ))}
              </select>
            ))}

            <button
              className="bg-blue-500 text-white px-3 py-1 rounded mb-3"
              onClick={addRoom}
            >
              ➕ Añadir habitación
            </button>

            <input
              type="date"
              className="w-full border rounded p-2 mb-2"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
            />

            <select
              className="w-full border rounded p-2 mb-2"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            >
              <option value="parcial">Parcial</option>
              <option value="pagado">Pagado</option>
            </select>

            <input
  type="number"
  className="w-full border rounded p-2 mb-2"
  placeholder="Monto pagado"
  value={amountPaid === 0 ? "" : amountPaid} // 👈 vacío si es 0
  onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
/>


            <div className="flex justify-end mt-4">
              <button
                className="bg-yellow-600 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Guardar
              </button>
            </div>
          </div>

          {/* Reservas existentes */}
          <div>
            <h3 className="text-md font-semibold mb-3">Reservas del día</h3>
            {reservations.length === 0 && (
              <p className="text-gray-500">No hay reservas registradas.</p>
            )}
            {reservations.map((r) => (
              <div
                key={r.reservationId}
                className="border rounded p-3 mb-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{r.guestName}</p>
                  <p className="text-sm text-gray-600">
                    Hab(s):{" "}
                    {r.rooms.map((rm) => `${rm.number} (${rm.type})`).join(", ")}
                  </p>
                  <p className="text-sm text-gray-800">
                    {r.paymentStatus === "pagado"
                      ? `Pagado: RD$${r.amountPaid} / Total: RD$${r.totalPrice}`
                      : `Parcial: RD$${r.amountPaid} / Restante: RD$${r.remaining} / Total: RD$${r.totalPrice}`}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span
                    onClick={() => handleTogglePayment(r.reservationId, r.paymentStatus)}
                    className={`cursor-pointer px-3 py-1 rounded text-white text-sm ${
                      r.paymentStatus === "pagado"
                        ? "bg-green-500"
                        : "bg-yellow-400 text-black"
                    }`}
                  >
                    {r.paymentStatus === "pagado" ? "Pagado" : "Parcial"}
                  </span>
                  <button
                    onClick={() => handleDelete(r.reservationId)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
