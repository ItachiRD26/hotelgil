"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Habitaciones", href: "/habitaciones" },
    { name: "Servicios", href: "#servicios" },
    { name: "Políticas", href: "#politicas" },
    { name: "Contacto", href: "#contacto" },
  ];

  return (
    <header className="w-full shadow-md bg-white sticky top-0 z-50">
      {/* Topbar */}
      <div className="bg-yellow-600 text-white text-sm py-2 px-6 flex justify-between items-center">
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="https://goo.gl/maps/XXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:underline"
          >
            <FaMapMarkerAlt size={14} className="text-white" />
            <span>
              Calle Rodriguez Camargo #123, Montecristi, República Dominicana
            </span>
          </a>
          <a href="tel:+18095792629" className="flex items-center space-x-2 hover:underline">
            <FaPhoneAlt size={14} className="text-white" />
            <span>+1 (809) 579-2629</span>
          </a>
        </div>

        <div className="flex space-x-4">
          <a href="https://wa.me/18095792629" target="_blank" className="hover:text-black transition">
            <FaWhatsapp size={18} />
          </a>
          <a href="https://facebook.com/" target="_blank" className="hover:text-black transition">
            <FaFacebookF size={18} />
          </a>
          <a href="https://www.instagram.com/hotelgil_rd/" target="_blank" className="hover:text-black transition">
            <FaInstagram size={18} />
          </a>
        </div>
      </div>

      {/* Navbar */}
      <div className="flex justify-between items-center px-6 md:px-8 py-4 bg-white">
        {/* Logo con link a inicio */}
        <Link href="#inicio" className="flex items-center">
          <Image
            src="/logo-sinfondo.png"
            alt="Hotel Gil Logo"
            width={100}
            height={100}
            className="object-contain cursor-pointer"
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex space-x-6 text-lg font-medium text-gray-900">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-yellow-600 transition">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="https://wa.me/18095792629"
          target="_blank"
          className="hidden md:inline-block bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-yellow-700 transition"
        >
          Reservar
        </a>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg px-6 py-4 space-y-4 text-lg font-medium"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block hover:text-yellow-600 transition"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/18095792629"
              target="_blank"
              className="block bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-yellow-700 transition text-center"
            >
              Reservar
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
