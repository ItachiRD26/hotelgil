"use client";

import Image from "next/image";
import Link from "next/link";

const rooms = [
  {
    id: "sencilla",
    name: "Habitación Sencilla",
    description: "Cómoda habitación sencilla ideal para una estancia práctica.",
    price: 1200,
    images: ["/sencilla-2.jpg", "/sencilla-1.jpg"],
  },
  {
    id: "doble",
    name: "Habitación Doble",
    description: "Amplia habitación doble perfecta para parejas o amigos.",
    price: 1700,
    images: ["/doble-2.jpg", "/doble-1.jpg"],
  },
  {
    id: "triple",
    name: "Habitación Triple",
    description: "Espaciosa habitación triple ideal para familias o grupos.",
    price: 2200,
    images: ["/triple-2.jpg", "/triple-1.jpg"],
  },
];

export default function Rooms() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Nuestras Habitaciones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-md overflow-hidden group"
            >
              {/* Imagen con proporción fija */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={room.images[0]}
                  alt={room.name}
                  fill
                  className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                <Image
                  src={room.images[1]}
                  alt={room.name}
                  fill
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold">{room.name}</h3>
                <p className="text-gray-600 mb-2">{room.description}</p>
                <p className="text-yellow-600 font-semibold mb-4">
                  RD$ {room.price.toLocaleString()} / noche
                </p>
                <Link 
  href={`/habitaciones/${room.id}`} 
  className="cursor-pointer w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition"
>
  Ver detalles
</Link>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
