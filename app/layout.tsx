import "./global.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Hotel Gil",
  description: "Sistema de reservas",
  icons: {
    icon: "/logo-sinfondo.png", // Favicon principal
    shortcut: "/logo-sinfondo.png", // Atajo
    apple: "/logo-sinfondo.png", // Apple touch icon
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "10px",
            },
            success: {
              style: { background: "#22c55e" }, // verde
            },
            error: {
              style: { background: "#ef4444" }, // rojo
            },
          }}
        />

        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: `
{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Hotel Gil",
  "image": "https://hotelgil.com.do/hotel-hero.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle Rodriguez Camargo #123",
    "addressLocality": "Montecristi",
    "addressRegion": "Montecristi",
    "postalCode": "62000",
    "addressCountry": "DO"
  },
  "telephone": "+1-809-000-0000",
  "url": "https://hotelgil.com.do",
  "priceRange": "$$",
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "WiFi gratis", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Aire acondicionado", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Restaurante", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Parqueo", "value": true }
  ]
}
    `,
  }}
/>

      </body>
    </html>
  );
}
