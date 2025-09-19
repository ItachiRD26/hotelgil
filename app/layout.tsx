import "./globals.css";
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
      </body>
    </html>
  );
}
