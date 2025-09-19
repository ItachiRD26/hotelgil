"use client";

import { FaRegFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Policies() {
  const items = [
    {
      title: "Horario",
      desc: "El check-in se realiza a partir de las 3:00 PM y el check-out hasta las 12:00 PM.",
    },
    {
      title: "Cancelaciones",
      desc: "Se permiten cancelaciones sin penalidad con al menos 24 horas de antelación.",
    },
    {
      title: "Normas",
      desc: "Está prohibido fumar dentro de las habitaciones. Contamos con áreas designadas para fumadores.",
    },
    {
      title: "Pagos",
      desc: "Aceptamos pagos en efectivo, transferencias y tarjetas de crédito.",
    },
  ];

  return (
    <motion.section
      id="politicas"
      className="py-16 px-6 bg-gray-50"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <FaRegFileAlt size={50} className="text-yellow-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Políticas del Hotel
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-left">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-yellow-600 mb-2">
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
