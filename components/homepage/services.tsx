"use client";

import { FaWifi, FaParking } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Services() {
  const services = [
    {
      name: "Wi-Fi Gratuito",
      icon: <FaWifi size={40} className="text-yellow-600" />,
      description: "Conéctese en todo momento con nuestro internet de alta velocidad.",
    },
    {
      name: "Parqueo Privado",
      icon: <FaParking size={40} className="text-yellow-600" />,
      description: "Estacione con seguridad en nuestras instalaciones exclusivas para huéspedes.",
    },
  ];

  return (
    <motion.section
      id="servicios"
      className="relative py-20 px-6 bg-white"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
    >
      {/* Separador onda arriba */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-full h-12 text-white"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0V46.29c47.95,22,103.43,29.05,158,23,70-8,136-33,206-35.57,73-3,142,19,218,35.57,65,14,131,18,196,5,48-10,95-27,143-32s94,1,139,9c66,12,130,20,196,9V0Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Nuestros Servicios
        </h2>
        <p className="text-gray-700 mb-12">
          Todo lo que necesita para disfrutar de su estadía con comodidad.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition text-center"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-2xl font-semibold text-yellow-600 mb-3">
                {service.name}
              </h3>
              <p className="text-gray-700">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Separador onda abajo */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-12 text-white"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0V46.29c47.95,22,103.43,29.05,158,23,70-8,136-33,206-35.57,73-3,142,19,218,35.57,65,14,131,18,196,5,48-10,95-27,143-32s94,1,139,9c66,12,130,20,196,9V0Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </motion.section>
  );
}
