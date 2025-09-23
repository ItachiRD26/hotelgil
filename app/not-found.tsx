import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-6">
      <h1 className="text-6xl font-bold text-yellow-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
      <p className="text-gray-600 mb-6">Lo sentimos, la página que buscas no existe o fue movida.</p>
      <Link
        href="/"
        className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-yellow-700 transition"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
