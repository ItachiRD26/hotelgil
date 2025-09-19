"use client";

import { FaRegClock, FaSmoking, FaCarAlt, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Policies() {
  const items = [
    {
      title: "Horario",
      desc: "El check-in se realiza a partir de las 3:00 PM y el check-out hasta las 12:00 PM.",
      icon: <FaRegClock size={40} className="text-yellow-600" />,
    },
    {
      title: "Cancelaciones",
      desc: "En caso de cancelación, el hotel se reserva el derecho de retener una parte del pago realizado.",
      icon: <FaTimesCircle size={40} className="text-yellow-600" />,
    },
    {
      title: "Normas",
      desc: "Está prohibido fumar dentro de las habitaciones.",
      icon: <FaSmoking size={40} className="text-yellow-600" />,
    },
    {
      title: "Parqueos",
      desc: "El uso del parqueo está disponible exclusivamente para huéspedes registrados durante su estadía.",
      icon: <FaCarAlt size={40} className="text-yellow-600" />,
    },
  ];

  return (
    <motion.section
      id="politicas"
      className="py-20 px-6 bg-white"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Políticas del Hotel
        </h2>
        <p className="text-gray-600 mb-12">
          Nuestro compromiso es brindarle una experiencia clara y segura.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md border border-yellow-200 hover:shadow-lg transition text-center"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-2xl font-semibold text-yellow-600 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-700">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
