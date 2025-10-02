"use client";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative h-[90vh] flex items-center justify-center text-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/hotel-hero.jpg')", // 🔹 reemplaza con foto real
      }}
    >
      {/* Overlay degradado */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-sm" />

      {/* Contenido */}
      <div className="relative z-10 text-white max-w-3xl px-6">
        <h1 className="text-6xl font-extrabold mb-5 drop-shadow-lg">
          Bienvenido a <br /> <span className="text-yellow-500">Hotel GIL</span>
        </h1>
        <p className="text-2xl mb-8 text-gray-100 font-light drop-shadow-md">
          Confort y elegancia en cada estancia
        </p>
        <a
          href="https://wa.me/18296707464" // 🔹 tu WhatsApp Business
          target="_blank"
          className="bg-yellow-600 text-white px-8 py-4 rounded-lg font-semibold shadow-xl hover:bg-yellow-700 hover:scale-105 transition transform"
        >
          Reserva ahora
        </a>
      </div>
    </section>
  );
}
