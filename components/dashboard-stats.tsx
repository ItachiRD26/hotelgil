"use client";

import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { getMonthStats } from "@/lib/reservations-db";

export type DashboardStatsRef = {
  refresh: (start?: Date) => void;
};

const DashboardStats = forwardRef<DashboardStatsRef>((_, ref) => {
  const [stats, setStats] = useState<{ total: number; cobrado: number; pendiente: number }>({
    total: 0,
    cobrado: 0,
    pendiente: 0,
  });

  const loadStats = async (date: Date = new Date()) => {
    const res = await getMonthStats(date.getFullYear(), date.getMonth());
    setStats(res);
  };

  useEffect(() => {
    loadStats();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: (start?: Date) => loadStats(start),
  }));

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-100 rounded-lg shadow p-4">
        <h4 className="text-sm font-semibold text-gray-600">Total facturado</h4>
        <p className="text-xl font-bold text-gray-900">RD${stats.total.toLocaleString()}</p>
      </div>
      <div className="bg-green-100 rounded-lg shadow p-4">
        <h4 className="text-sm font-semibold text-green-600">Cobrado</h4>
        <p className="text-xl font-bold text-green-800">RD${stats.cobrado.toLocaleString()}</p>
      </div>
      <div className="bg-yellow-100 rounded-lg shadow p-4">
        <h4 className="text-sm font-semibold text-yellow-600">Pendiente</h4>
        <p className="text-xl font-bold text-yellow-800">RD${stats.pendiente.toLocaleString()}</p>
      </div>
    </div>
  );
});

DashboardStats.displayName = "DashboardStats";
export default DashboardStats;
