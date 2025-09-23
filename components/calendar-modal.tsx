"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { createReservation, getReservationsByDate, getMonthDayIndex } from "@/lib/reservations-db"
import type { PaymentStatus, Reservation, PaymentMethod } from "@/types/reservation"
import type { Room } from "@/types/room"
import ReservationDetailModal from "./reservation-detail-modal"
import { rooms as allRooms } from "@/lib/room"
import Toast from "./toast"
import { normalizeDate, toLocalDMY } from "@/utils/date"

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string // YYYY-MM-DD
  onDataChange: () => void
}

type OccupyRange = { from: string; to: string }
type OccupiedMap = Record<string, OccupyRange | undefined>

// 👉 función utilitaria para fecha local RD
function getTodayDR() {
  const now = new Date()
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santo_Domingo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  return fmt.format(now) // "YYYY-MM-DD"
}

export default function CalendarModal({ isOpen, onClose, selectedDate, onDataChange }: CalendarModalProps) {
  const [guestName, setGuestName] = useState("")
  const [checkoutDate, setCheckoutDate] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("parcial")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Efectivo")
  const [amountPaid, setAmountPaid] = useState(0)

  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [detailReservation, setDetailReservation] = useState<Reservation | null>(null)

  const [occupiedMap, setOccupiedMap] = useState<OccupiedMap>({})
  const [ddOpen, setDdOpen] = useState(false)
  const [conflictMsg, setConflictMsg] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const [multiSelect, setMultiSelect] = useState(false)

  const ddRef = useRef<HTMLDivElement>(null)
  const availableRooms: Room[] = useMemo(() => allRooms, [])

  const today = getTodayDR()

  const loadReservations = useCallback(async () => {
    if (!selectedDate) return
    const res = await getReservationsByDate(selectedDate)
    setReservations(res)
  }, [selectedDate])

  useEffect(() => {
    if (isOpen) loadReservations()
  }, [isOpen, loadReservations]) // Added loadReservations to dependencies

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ddRef.current) return
      if (!ddRef.current.contains(e.target as Node)) setDdOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  useEffect(() => {
    const computeOccupied = async () => {
      if (!selectedDate) return
      const end = checkoutDate || selectedDate
      const dayIndex = await getMonthDayIndex(selectedDate, end)

      const map: Record<string, { min: string; max: string }> = {}
      for (const d of dayIndex) {
        for (const rn of d.roomNumbers) {
          if (!map[rn]) {
            map[rn] = { min: d.date, max: d.date }
          } else {
            if (d.date < map[rn].min) map[rn].min = d.date
            if (d.date > map[rn].max) map[rn].max = d.date
          }
        }
      }

      const occ: OccupiedMap = {}
      Object.entries(map).forEach(([roomNumber, r]) => {
        occ[roomNumber] = { from: r.min, to: r.max }
      })
      setOccupiedMap(occ)
    }
    computeOccupied()
  }, [selectedDate, checkoutDate])

  const isUnavailable = (roomNumber: string) => Boolean(occupiedMap[roomNumber])
  const unavailabilityLabel = (roomNumber: string) => {
    const r = occupiedMap[roomNumber]
    return r ? ` (Reservada ${toLocalDMY(r.from)} – ${toLocalDMY(r.to)})` : ""
  }

  const toggleRoomByNumber = (roomNumber: string) => {
    const room = availableRooms.find((r) => r.roomNumber === roomNumber)
    if (!room) return

    const occ = occupiedMap[room.roomNumber]
    if (occ) {
      const rangeTxt =
        occ.from === occ.to ? `el ${toLocalDMY(occ.from)}` : `del ${toLocalDMY(occ.from)} al ${toLocalDMY(occ.to)}`
      setConflictMsg(
        `La habitación ${room.roomNumber} está ocupada ${rangeTxt}. ` +
          `Por favor, selecciona otra fecha u otra habitación.`,
      )
      return
    }

    setSelectedRooms((prev) => {
      const already = prev.some((r) => r.roomNumber === room.roomNumber)
      const updated = already ? prev.filter((r) => r.roomNumber !== room.roomNumber) : [...prev, room]

      if (!multiSelect) {
        setDdOpen(false)
      }
      return updated
    })
  }

  const handleSave = async () => {
    if (!guestName || !selectedDate || !checkoutDate || selectedRooms.length === 0) {
      setConflictMsg("Completa huésped, fechas y al menos una habitación.")
      return
    }

    const nights = Math.max(
      (new Date(checkoutDate).getTime() - new Date(selectedDate).getTime()) / (1000 * 60 * 60 * 24),
      1,
    )

    const totalRoomsAmount = selectedRooms.reduce((s, r) => s + r.price * nights, 0)

    const finalAmount = paymentStatus === "pagado" ? totalRoomsAmount : amountPaid

    await createReservation({
      guestName,
      rooms: selectedRooms,
      checkinDate: normalizeDate(selectedDate),
      checkoutDate: normalizeDate(checkoutDate),
      paymentStatus,
      paymentMethod,
      amountPaid: finalAmount,
    })

    onDataChange()
    await loadReservations()

    setGuestName("")
    setCheckoutDate("")
    setPaymentStatus("parcial")
    setPaymentMethod("Efectivo")
    setAmountPaid(0)
    setSelectedRooms([])

    setToastMsg("Reserva guardada exitosamente ✅")
    onClose()
  }

  if (!isOpen) return null

  const nights =
    checkoutDate && selectedDate
      ? Math.max((new Date(checkoutDate).getTime() - new Date(selectedDate).getTime()) / (1000 * 60 * 60 * 24), 1)
      : 1

  const totalRoomsAmount = selectedRooms.reduce((s, r) => s + r.price * nights, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/70 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl rounded-xl bg-white p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-3 top-3 text-gray-600 hover:text-black">
          ✕
        </button>

        <h2 className="mb-6 text-xl font-bold">Reservas para {toLocalDMY(selectedDate)}</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Nueva reserva */}
          <div>
            <h3 className="mb-2 text-md font-semibold">Nueva reserva</h3>

            <input
              className="mb-2 w-full rounded border p-2"
              placeholder="Nombre del huésped"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />

            <label className="mb-1 block text-xs text-gray-500">Fecha de salida</label>
            <input
              type="date"
              className="mb-3 w-full rounded border p-2"
              value={checkoutDate}
              min={selectedDate || today} // ✅ permite seleccionar hoy
              onChange={(e) => setCheckoutDate(e.target.value)}
            />

            {/* Dropdown */}
            <div className="mb-3" ref={ddRef}>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold">Habitaciones disponibles</h4>
                <label className="flex items-center gap-1 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={multiSelect}
                    onChange={(e) => setMultiSelect(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Múltiple
                </label>
              </div>

              <button
                type="button"
                onClick={() => setDdOpen((s) => !s)}
                className="flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-left shadow-sm hover:border-gray-400"
              >
                <span className="truncate text-sm text-gray-700">
                  {selectedRooms.length === 0
                    ? "Seleccionar habitación(es)"
                    : selectedRooms.map((r) => `Hab ${r.roomNumber}`).join(", ")}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition ${ddOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {ddOpen && (
                <div className="absolute z-50 mt-2 max-h-64 w-[32rem] overflow-auto rounded-xl border bg-white p-2 shadow-2xl">
                  {availableRooms.map((room) => {
                    const disabled = isUnavailable(room.roomNumber)
                    const checked = selectedRooms.some((r) => r.roomNumber === room.roomNumber)
                    return (
                      <button
                        key={room.roomNumber}
                        type="button"
                        onClick={() => toggleRoomByNumber(room.roomNumber)}
                        disabled={disabled}
                        className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${
                          disabled ? "cursor-not-allowed bg-gray-100 opacity-70" : "hover:bg-gray-50"
                        } ${checked ? "ring-1 ring-yellow-400" : ""}`}
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Habitación {room.roomNumber} – {room.roomType}
                          </div>
                          <div className="text-xs text-gray-500">
                            RD${room.price.toLocaleString()} por noche
                            <span className="text-red-600">{unavailabilityLabel(room.roomNumber)}</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Total habitaciones */}
            {selectedRooms.length > 0 && (
              <div className="mt-2 text-sm font-semibold text-gray-800">
                Total ({nights} noche(s)): RD${totalRoomsAmount.toLocaleString()}
              </div>
            )}

            <select
              className="mb-2 mt-3 w-full rounded border p-2"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            >
              <option value="parcial">Parcial</option>
              <option value="pagado">Pagado</option>
            </select>

            {paymentStatus === "parcial" && (
              <>
                <input
                  type="number"
                  className="mb-2 w-full rounded border p-2"
                  placeholder="Monto pagado"
                  value={amountPaid === 0 ? "" : amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
                />

                {selectedRooms.length > 0 && (
                  <div className="mb-2 text-sm text-gray-700">
                    Restante:{" "}
                    <span className="font-semibold text-red-600">
                      RD${Math.max(totalRoomsAmount - amountPaid, 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </>
            )}

            <select
              className="mb-4 w-full rounded border p-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>

            <button onClick={handleSave} className="rounded bg-black px-4 py-2 text-white hover:bg-yellow-600">
              Guardar reserva
            </button>
          </div>

          {/* Reservas existentes */}
          <div>
            <h3 className="mb-2 text-md font-semibold">Reservas existentes</h3>
            {reservations.length > 0 ? (
              <ul className="space-y-2">
                {reservations.map((r) => (
                  <li
                    key={r.reservationId}
                    className="cursor-pointer rounded border p-2 hover:bg-gray-100"
                    onClick={() => setDetailReservation(r)}
                  >
                    <span className="font-medium">{r.guestName}</span> –{" "}
                    {r.rooms.map((room) => room.roomNumber).join(", ")} (
                    {r.paymentStatus === "pagado" ? (
                      <span className="font-semibold text-green-600">Pagado</span>
                    ) : (
                      <span className="font-semibold text-yellow-600">Parcial (RD${r.amountPaid})</span>
                    )}
                    )
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No hay reservas registradas</p>
            )}
          </div>
        </div>
      </div>

      {detailReservation && (
        <ReservationDetailModal
          reservation={detailReservation}
          onClose={() => setDetailReservation(null)}
          onUpdated={async () => {
            await loadReservations()
            onDataChange()
          }}
        />
      )}

      {conflictMsg && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-16">
          <div className="w-full max-w-md rounded-xl bg-white p-5 text-center shadow-2xl ring-1 ring-black/10">
            <h4 className="mb-2 text-base font-semibold text-red-600">Aviso de disponibilidad</h4>
            <p className="mb-4 text-sm text-gray-700">{conflictMsg}</p>
            <button
              onClick={() => setConflictMsg(null)}
              className="rounded bg-black px-4 py-2 text-white hover:bg-yellow-600"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  )
}
