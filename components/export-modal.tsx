"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { Reservation } from "@/types/reservation";
import { Room } from "@/types/room";

// 🔹 Convierte fecha a formato local
function toLocalDMY(date: string): string {
  return new Date(date).toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// 🔹 Logo como base64
async function getBase64FromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
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

  const handleExport = async () => {
    const snapshot = await get(ref(db, "reservations"));
    if (!snapshot.exists()) return;

    const reservations: Reservation[] = Object.values(snapshot.val()) as Reservation[];

    let filtered: Reservation[] = [];

    if (filterType === "día" && day) {
      filtered = reservations.filter((r) => r.checkinDate === day);
    } else if (filterType === "mes") {
      filtered = reservations.filter((r) => {
        const d = new Date(r.checkinDate);
        return (
          d.getMonth() === parseInt(month) &&
          d.getFullYear() === parseInt(year)
        );
      });
    } else if (filterType === "año") {
      filtered = reservations.filter(
        (r) => new Date(r.checkinDate).getFullYear() === parseInt(year)
      );
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

      const cobrado =
        r.paymentStatus === "pagado" ? totalRooms : r.amountPaid || 0;
      const pendiente =
        r.paymentStatus === "pagado" ? 0 : Math.max(totalRooms - cobrado, 0);

      totalCobrado += cobrado;
      totalPendiente += pendiente;

      return [
        toLocalDMY(r.checkinDate),
        r.guestName,
        r.rooms.map((room) => room.roomNumber).join(", "),
        r.paymentStatus === "pagado" ? "Pagado" : "Parcial",
        `RD$ ${cobrado.toLocaleString()}`,
        `RD$ ${pendiente.toLocaleString()}`,
      ];
    });

    // 🔹 Agregar fila de totales
    if (rows.length > 0) {
      rows.push([
        "TOTAL",
        "",
        "",
        "",
        `RD$ ${totalCobrado.toLocaleString()}`,
        `RD$ ${totalPendiente.toLocaleString()}`,
      ]);
    }

    // 🔹 Excel data
    const wsData = [
      ["Hotel Gil"],
      [
        `Resumen del ${
          filterType === "día"
            ? `Día ${toLocalDMY(day)}`
            : filterType === "mes"
            ? `Mes ${parseInt(month) + 1}-${year}`
            : `Año ${year}`
        }`,
      ],
      [],
      ["Fecha", "Huésped", "Habitaciones", "Estado", "Cobrado", "Pendiente"],
      ...rows,
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // 🔹 Bordes para todas las celdas
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1:F1");
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;
        ws[cellRef].s = {
          ...ws[cellRef].s,
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }

    // 🔹 Estilo de encabezados
    ["A4", "B4", "C4", "D4", "E4", "F4"].forEach((c) => {
      if (ws[c]) {
        ws[c].s = {
          ...ws[c].s,
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "1F4E78" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    });

    // 🔹 Estilo de fila de totales
    const lastRow = 4 + rows.length;
    ["A", "B", "C", "D", "E", "F"].forEach((col) => {
      const cell = `${col}${lastRow}`;
      if (ws[cell]) {
        ws[cell].s = {
          ...ws[cell].s,
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "333333" } },
          alignment: { horizontal: col >= "E" ? "right" : "center" },
        };
      }
    });

    // 🔹 Alinear montos
    for (let i = 5; i <= lastRow; i++) {
      ["E", "F"].forEach((col) => {
        const cell = `${col}${i}`;
        if (ws[cell]) {
          ws[cell].s = {
            ...ws[cell].s,
            alignment: { horizontal: "right" },
          };
        }
      });
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resumen");

    // 🔹 Insertar logo
    try {
      const logoBase64 = await getBase64FromUrl("/logo-hotelgil.png");
      if (!ws["!images"]) ws["!images"] = [];
      ws["!images"].push({
        name: "Hotel Gil",
        data: logoBase64,
        type: "image/png",
        position: { type: "twoCellAnchor", from: { r: 0, c: 0 }, to: { r: 2, c: 2 } },
      });
    } catch (err) {
      console.warn("No se pudo cargar el logo:", err);
    }

    // 🔹 Nombre dinámico
    const fileName =
      filterType === "día"
        ? `Resumen del Día ${toLocalDMY(day)}.xlsx`
        : filterType === "mes"
        ? `Resumen del Mes ${parseInt(month) + 1}-${year}.xlsx`
        : `Resumen del Año ${year}.xlsx`;

    XLSX.writeFile(wb, fileName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/70 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Exportar Datos</h2>

        {/* Tipo de filtro */}
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

        {/* Día */}
        {filterType === "día" && (
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          />
        )}

        {/* Mes */}
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

        {/* Año */}
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
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}
