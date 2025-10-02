import Header from "@/components/homepage/header";
import Hero from "@/components/homepage/hero";
import Rooms from "@/components/homepage/rooms";
import Policies from "@/components/homepage/policies";
import Contact from "@/components/homepage/contact";
import Services from "@/components/homepage/services";
import Footer from "@/components/homepage/footer";


import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hotel Gil | Hospedaje en Montecristi, República Dominicana",
  description:
    "Disfruta de una experiencia única en Hotel Gil. Habitaciones cómodas, atención personalizada y la mejor ubicación en Montecristi.",
  keywords: [
    "Hotel Montecristi",
    "Hotel Gil",
    "Hospedaje República Dominicana",
    "Alojamiento Montecristi",
    "Reservar hotel RD",
  ],
  openGraph: {
    title: "Hotel Gil | Hospedaje en Montecristi",
    description:
      "Habitaciones confortables y hospitalidad en el corazón de Montecristi. ¡Reserva hoy tu estadía!",
    url: "https://hotelgil.com.do",
    siteName: "Hotel Gil",
    images: [
      {
        url: "https://hotelgil.com.do/hotel-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Hotel Gil Montecristi",
      },
    ],
    locale: "es_DO",
    type: "website",
  },
  alternates: {
    canonical: "https://hotelgil.com.do",
  },
}

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      <Header />
      <Hero />
      <Rooms />
      <Services />
      <Policies />
      <Contact />
      <Footer />

    </div>
  );
}
