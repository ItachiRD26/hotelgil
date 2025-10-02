"use client"

import { useEffect, useImperativeHandle, useState, forwardRef } from "react"
import { getMonthStats } from "@/lib/reservations-db"
import ExportModal from "./export-modal"

export interface DashboardStatsRef {
  refresh: (date: Date) => void
}

const DashboardStats = forwardRef<DashboardStatsRef>((props, ref) => {
  const [total, setTotal] = useState(0)
  const [cobrado, setCobrado] = useState(0)
  const [pendiente, setPendiente] = useState(0)
  const [exportOpen, setExportOpen] = useState(false)

  const loadStats = async (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const { total, cobrado, pendiente } = await getMonthStats(year, month)
    setTotal(total)
    setCobrado(cobrado)
    setPendiente(pendiente)
  }

  useImperativeHandle(ref, () => ({
    refresh: (date: Date) => loadStats(date),
  }))

  useEffect(() => {
    loadStats(new Date())
  }, [])

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-semibold">Estadísticas del mes</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total facturado */}
        <div className="rounded-xl border bg-blue-50 p-4 shadow">
          <h4 className="text-sm font-medium text-gray-600">Total facturado</h4>
          <p className="mt-1 text-2xl font-bold text-blue-700">
            RD${total.toLocaleString()}
          </p>
        </div>

        {/* Cobrado */}
        <div className="rounded-xl border bg-green-50 p-4 shadow">
          <h4 className="text-sm font-medium text-gray-600">Cobrado</h4>
          <p className="mt-1 text-2xl font-bold text-green-700">
            RD${cobrado.toLocaleString()}
          </p>
        </div>

        {/* Pendiente */}
        <div className="rounded-xl border bg-yellow-50 p-4 shadow">
          <h4 className="text-sm font-medium text-gray-600">Pendiente</h4>
          <p className="mt-1 text-2xl font-bold text-yellow-700">
            RD${pendiente.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Botón exportar */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setExportOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
        >
          📊 Exportar Datos
        </button>
      </div>

      {exportOpen && <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} />}
    </div>
  )
})

DashboardStats.displayName = "DashboardStats"

export default DashboardStats
