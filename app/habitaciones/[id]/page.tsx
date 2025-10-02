import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface Room {
  title: string;
  images: string[];
  description: string;
  features: string[];
  price: string;
}

const rooms: Record<string, Room> = {
  sencilla: {
    title: "Habitación Sencilla",
    images: ["/sencilla-2.jpg", "/bano-1.jpg"],
    description: "Perfecta para una persona con cama matrimonial, aire acondicionado, baño privado y WiFi gratis.",
    features: ["Cama matrimonial", "Baño privado", "Aire acondicionado", "WiFi gratis", "TV por cable"],
    price: "RD$ 1,200 / noche",
  },
  doble: {
    title: "Habitación Doble",
    images: ["/doble-1.jpg", "/bano-1.jpg"],
    description: "Ideal para dos personas, con dos camas dobles, aire acondicionado y baño privado.",
    features: ["2 camas dobles", "Baño privado", "Aire acondicionado", "WiFi gratis", "TV por cable"],
    price: "RD$ 1,700 / noche",
  },
  triple: {
    title: "Habitación Triple",
    images: ["/triple-2.jpg", "/bano-1.jpg"],
    description: "Espaciosa para familias o grupos, con tres camas, aire acondicionado y baño privado.",
    features: ["3 camas individuales", "Baño privado", "Aire acondicionado", "WiFi gratis", "TV por cable"],
    price: "RD$ 2,200 / noche",
  },
}
export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const room = rooms[params.id]
  if (!room) return notFound()

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      {/* Botón volver */}
      <div className="mb-6">
        <Link
          href="/habitaciones"
          className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          ← Volver
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">{room.title}</h1>

      {/* Galería en grid responsiva */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {room.images.map((img: string, i: number) => (
          <div key={i} className="relative aspect-[4/3]">
            <Image
              src={img}
              alt={room.title}
              fill
              className="object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>

      <p className="text-gray-700 mb-4 text-lg">{room.description}</p>

      <ul className="list-disc list-inside mb-6 text-gray-600">
        {room.features.map((f: string, i: number) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <p className="font-semibold text-lg mb-6">{room.price}</p>

      <div className="text-center">
        <Link
          href="https://wa.me/18090000000?text=Hola,%20quiero%20reservar%20una%20habitación%20en%20Hotel%20Gil"
          className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
        >
          Reservar ahora
        </Link>
      </div>
    </div>
  )
}