"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import Image from "next/image";

const auth = getAuth(app);

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && pathname !== "/administracion/login") {
        router.push("/administracion/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/administracion/login");
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-4 bg-white text-yellow-500 shadow-md">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-hotelgil.png" // asegúrate de poner el logo en /public
            alt="Hotel Gil"
            width={80}
            height={80}
          />
          <h1 className="text-lg font-bold">Hotel Gil – Administración</h1>
        </div>
        {pathname !== "/administracion/login" && (
          <button
            onClick={handleLogout}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition cursor-pointer"
          >
            Cerrar sesión
          </button>
        )}
      </header>

      {/* Contenido */}
      <main className="p-6">{children}</main>
    </div>
  );
}