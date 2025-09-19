"use client";

import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { getMonthStats } from "@/lib/reservations-db";
import ExportModal from "./export-modal";

export type DashboardStatsRef = {
  refresh: (start?: Date) => void;
};

interface Stats {
  total: number;
  cobrado: number;
  pendiente: number;
}

const DashboardStats = forwardRef<DashboardStatsRef>((props, ref) => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    cobrado: 0,
    pendiente: 0,
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const loadStats = async (start?: Date) => {
    const date = start || new Date();
    const year = date.getFullYear();
    const month = date.getMonth(); // 0 = enero
    const data = await getMonthStats(year, month);
    setStats(data);
  };

  useEffect(() => {
    loadStats();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: (start?: Date) => loadStats(start),
  }));

  return (
    <div className="rounded-lg border p-4 shadow-sm bg-white mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Estadísticas del mes</h3>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="ml-auto rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 shadow cursor-pointer"
        >
          📊 Exportar Datos
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded bg-gray-100 p-3">
          <p className="text-sm font-medium">Total facturado</p>
          <p className="text-lg font-bold">RD${stats.total.toLocaleString()}</p>
        </div>
        <div className="rounded bg-green-100 p-3">
          <p className="text-sm font-medium">Cobrado</p>
          <p className="text-lg font-bold text-green-600">
            RD${stats.cobrado.toLocaleString()}
          </p>
        </div>
        <div className="rounded bg-yellow-100 p-3">
          <p className="text-sm font-medium">Pendiente</p>
          <p className="text-lg font-bold text-yellow-600">
            RD${stats.pendiente.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Modal de exportación */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
});

DashboardStats.displayName = "DashboardStats";
export default DashboardStats;
