"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Rooms() {
  const rooms = [
    {
      name: "Habitación Sencilla",
      price: 1200,
      images: ["/habitacion-sencilla-1.jpg", "/habitacion-sencilla-2.jpg"],
      description: "Cómoda habitación sencilla ideal para una estancia práctica.",
    },
    {
      name: "Habitación Doble",
      price: 1700,
      images: ["/habitacion-doble-1.jpg", "/habitacion-doble-2.jpg"],
      description: "Amplia habitación doble perfecta para parejas o amigos.",
    },
  ];

  return (
    <motion.section
      id="habitaciones"
      className="py-16 px-6 bg-gray-50"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
    >
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
        Nuestras Habitaciones
      </h2>

      <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
        {rooms.map((room, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative group"
          >
            <div className="relative w-full h-64 overflow-hidden">
              <Image
                src={room.images[0]}
                alt={room.name}
                width={600}
                height={400}
                className="w-full h-64 object-cover absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
              />
              <Image
                src={room.images[1]}
                alt={room.name}
                width={600}
                height={400}
                className="w-full h-64 object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {room.name}
              </h3>
              <p className="text-gray-600 mb-4">{room.description}</p>
              <p className="text-yellow-600 font-bold text-xl mb-4">
                RD$ {room.price.toLocaleString()} / noche
              </p>
              <a
                href="https://wa.me/18090000000"
                target="_blank"
                className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-yellow-700 transition"
              >
                Reservar ahora
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
