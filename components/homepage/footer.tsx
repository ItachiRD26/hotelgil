"use client";

import Image from "next/image";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-sinfondo.png"
            alt="Hotel Gil"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Navegación */}
        <nav className="flex flex-wrap justify-center gap-6 text-gray-700 font-medium mb-6">
          <a href="#inicio" className="hover:text-yellow-600 transition">Inicio</a>
          <a href="#habitaciones" className="hover:text-yellow-600 transition">Habitaciones</a>
          <a href="#servicios" className="hover:text-yellow-600 transition">Servicios</a>
          <a href="#politicas" className="hover:text-yellow-600 transition">Políticas</a>
          <a href="#contacto" className="hover:text-yellow-600 transition">Contacto</a>
        </nav>

        {/* Contacto */}
        <div className="text-gray-600 mb-6">
          <p>Calle Rodriguez Camargo #123, Montecristi, República Dominicana</p>
          <p>Tel: +1 (809) 579-2629</p>
        </div>

        {/* Redes sociales */}
        <div className="flex justify-center space-x-6 text-yellow-600 text-xl mb-6">
          <a href="https://wa.me/18095792629" target="_blank" className="hover:text-gray-800 transition">
            <FaWhatsapp />
          </a>
          <a href="https://facebook.com/" target="_blank" className="hover:text-gray-800 transition">
            <FaFacebookF />
          </a>
          <a href="https://www.instagram.com/hotelgil_rd/" target="_blank" className="hover:text-gray-800 transition">
            <FaInstagram />
          </a>
        </div>

        {/* Copy */}
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Hotel Gil. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
