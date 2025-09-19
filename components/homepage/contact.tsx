"use client";

import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Contact() {
  const contacts = [
    {
      title: "Dirección",
      desc: "Calle Rodriguez Camargo #123, Montecristi, República Dominicana",
      icon: <FaMapMarkerAlt size={36} className="text-yellow-600" />,
      link: "https://goo.gl/maps/QPgqzuiKuhmSJHVx7",
      label: "Abrir en Maps",
    },
    {
      title: "Teléfono",
      desc: "+1 (809) 000-0000",
      icon: <FaPhoneAlt size={36} className="text-yellow-600" />,
      link: "tel:+18090000000",
      label: "Llamar",
    },
    {
      title: "WhatsApp",
      desc: "Reserva y consultas vía WhatsApp",
      icon: <FaWhatsapp size={36} className="text-yellow-600" />,
      link: "https://wa.me/18090000000",
      label: "Escribir",
    },
  ];

  return (
    <motion.section
      id="contacto"
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
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Contáctanos</h2>
        <p className="text-gray-600 mb-12">
          Estamos disponibles para responder a todas sus consultas.
        </p>

        {/* Mapa */}
        <div className="mb-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.754844372973!2d-71.6410765!3d19.8503234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb143c187e5e173%3A0xfa8d5a95486cf3a3!2sHotel%20Gil!5e0!3m2!1ses!2sdo!4v1758230525908!5m2!1ses!2sdo"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl shadow-lg border border-yellow-200"
          ></iframe>
        </div>

        {/* Bloques de contacto */}
        <div className="grid md:grid-cols-3 gap-8">
          {contacts.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-3">{c.icon}</div>
              <h3 className="text-xl font-semibold text-yellow-600 mb-2">{c.title}</h3>
              <p className="text-gray-700 mb-4">{c.desc}</p>
              <a
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-yellow-700 transition"
              >
                {c.label}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
