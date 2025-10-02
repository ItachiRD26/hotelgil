import Image from "next/image"
import Link from "next/link"

const rooms = [
  {
    id: "sencilla",
    title: "Habitación Sencilla",
    description: "Cómoda y práctica, equipada con cama matrimonial, aire acondicionado y baño privado.",
    price: 1200,
    images: {
      room: "/sencilla-2.jpg",
      bath: "/bano-1.jpg",
    },
  },
  {
    id: "doble",
    title: "Habitación Doble",
    description: "Perfecta para dos personas, con dos camas dobles, baño privado y todas las comodidades.",
    price: 1700,
    images: {
      room: "/doble-1.jpg",
      bath: "/bano-1.jpg",
    },
  },
  {
    id: "triple",
    title: "Habitación Triple",
    description: "Amplia y cómoda para familias o grupos, con tres camas, baño privado y WiFi gratis.",
    price: 2200,
    images: {
      room: "/triple-2.jpg",
      bath: "/bano-1.jpg",
    },
  },
]

export default function HabitacionesPage() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Botón volver al inicio */}
        <div className="mb-6">
          <Link
            href="/#inicio"
            className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ← Volver al inicio
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Nuestras Habitaciones
        </h1>

        <div className="grid md:grid-cols-3 gap-10">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              {/* Galería 2 fotos lado a lado */}
              <div className="grid grid-cols-2 gap-1">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={room.images.room}
                    alt={room.title}
                    fill
                    className="object-cover rounded-l-xl"
                  />
                </div>
                <div className="relative aspect-[4/3]">
                  <Image
                    src={room.images.bath}
                    alt={`Baño ${room.title}`}
                    fill
                    className="object-cover rounded-r-xl"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{room.title}</h2>
                <p className="text-gray-600 mb-4">{room.description}</p>
                <p className="text-yellow-600 font-bold text-lg mb-6">
                  RD$ {room.price.toLocaleString()} / noche
                </p>

                <Link
                  href={`/habitaciones/${room.id}`}
                  className="block text-center bg-yellow-500 text-black font-semibold py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
