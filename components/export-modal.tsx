"use client";

import { useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { Reservation } from "@/types/reservation";
import { Room } from "@/types/room";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 🔹 Convierte fecha a formato local
function toLocalDMY(date: string): string {
  return new Date(date).toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [filterType, setFilterType] = useState("mes");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("0");
  const [year, setYear] = useState(new Date().getFullYear().toString());

  if (!isOpen) return null;

  const handleExportPDF = async () => {
    const snapshot = await get(ref(db, "reservations"));
    if (!snapshot.exists()) return;

    const reservations: Reservation[] = Object.values(snapshot.val()) as Reservation[];
    let filtered: Reservation[] = [];

    // 🔹 Filtrar por día
    if (filterType === "día" && day) {
      const target = new Date(day);
      filtered = reservations.filter((r) => {
        const checkin = new Date(r.checkinDate);
        const checkout = new Date(r.checkoutDate);
        return checkin <= target && checkout >= target;
      });

    // 🔹 Filtrar por mes
    } else if (filterType === "mes") {
      const monthStart = new Date(parseInt(year), parseInt(month), 1);
      const monthEnd = new Date(parseInt(year), parseInt(month) + 1, 0);

      filtered = reservations.filter((r) => {
        const checkin = new Date(r.checkinDate);
        const checkout = new Date(r.checkoutDate);
        return checkin <= monthEnd && checkout >= monthStart;
      });

    // 🔹 Filtrar por año
    } else if (filterType === "año") {
      const yearStart = new Date(parseInt(year), 0, 1);
      const yearEnd = new Date(parseInt(year), 11, 31);

      filtered = reservations.filter((r) => {
        const checkin = new Date(r.checkinDate);
        const checkout = new Date(r.checkoutDate);
        return checkin <= yearEnd && checkout >= yearStart;
      });
    }

    // 🔹 Calcular montos
    let totalCobrado = 0;
    let totalPendiente = 0;

    const rows = filtered.map((r) => {
      const checkin = new Date(r.checkinDate);
      const checkout = new Date(r.checkoutDate);
      const nights = Math.max(
        (checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24),
        1
      );

      const totalRooms = r.rooms.reduce(
        (sum: number, room: Room) => sum + room.price * nights,
        0
      );

      const cobrado = Math.min(
        r.paymentStatus === "pagado" ? totalRooms : r.amountPaid || 0,
        totalRooms
      );
      const pendiente =
        r.paymentStatus === "pagado" ? 0 : Math.max(totalRooms - cobrado, 0);

      totalCobrado += cobrado;
      totalPendiente += pendiente;

      // 🔹 Agrupar habitaciones por tipo
      const roomSummary: Record<string, number> = {};
      r.rooms.forEach((room) => {
        roomSummary[room.roomType] = (roomSummary[room.roomType] || 0) + 1;
      });
      const roomDisplay = Object.entries(roomSummary)
        .map(([type, count]) => `${type} (${count})`)
        .join(", ");

      return [
        toLocalDMY(r.checkinDate),
        toLocalDMY(r.checkoutDate),
        r.guestName,
        roomDisplay,
        r.paymentStatus === "pagado" ? "Pagado" : "Parcial",
        `RD$ ${cobrado.toLocaleString()}`,
        `RD$ ${pendiente.toLocaleString()}`,
      ];
    });

    // Crear documento PDF
    const doc = new jsPDF();

    // 🔹 Logo
    try {
      const img = new Image();
      img.src = "/logo-hotelgil.png";
      doc.addImage(img, "PNG", 15, 10, 30, 30);
    } catch {
      console.warn("No se pudo cargar el logo");
    }

    // 🔹 Título
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Hotel Gil - Resumen de Reservas", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(
      filterType === "día"
        ? `Día ${toLocalDMY(day)}`
        : filterType === "mes"
        ? `Mes ${parseInt(month) + 1}-${year}`
        : `Año ${year}`,
      105,
      28,
      { align: "center" }
    );

    // 🔹 Tabla con Check-in / Check-out y agrupación de habitaciones
    autoTable(doc, {
      startY: 40,
      head: [["Check-in", "Check-out", "Huésped", "Habitaciones", "Estado", "Cobrado", "Pendiente"]],
      body: rows,
      theme: "striped",
      headStyles: {
        fillColor: [31, 78, 120],
        textColor: [255, 255, 255],
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [242, 242, 242],
      },
    });

    // 🔹 Resumen Totales
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable?.finalY || 50;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Cobrado: RD$ ${totalCobrado.toLocaleString()}`, 14, finalY + 10);
    doc.text(`Total Pendiente: RD$ ${totalPendiente.toLocaleString()}`, 14, finalY + 18);

    // 🔹 Guardar archivo
    const fileName =
      filterType === "día"
        ? `Resumen_Dia_${toLocalDMY(day)}.pdf`
        : filterType === "mes"
        ? `Resumen_Mes_${parseInt(month) + 1}-${year}.pdf`
        : `Resumen_Año_${year}.pdf`;

    doc.save(fileName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/70 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Exportar Datos a PDF</h2>

        <label className="block mb-2 text-sm font-medium">Tipo de filtro</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        >
          <option value="día">Por Día</option>
          <option value="mes">Por Mes</option>
          <option value="año">Por Año</option>
        </select>

        {filterType === "día" && (
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          />
        )}

        {filterType === "mes" && (
          <div className="flex gap-2 mb-4">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-1/2 border rounded p-2"
            >
              {[
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre",
              ].map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-1/2 border rounded p-2"
            />
          </div>
        )}

        {filterType === "año" && (
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Exportar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
