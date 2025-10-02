"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth"
import { app } from "@/lib/firebase"
import Image from "next/image"

const auth = getAuth(app)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await setPersistence(auth, browserLocalPersistence) // 👈 aquí activas la caché local
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/administracion/dashboard")
    } catch {
      setError("Credenciales incorrectas o error al iniciar sesión.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo-hotelgil.png"
            alt="Hotel Gil Logo"
            width={180}
            height={180}
            className="rounded-md"
          />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Panel de Administración</h1>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="cursor-pointer w-full bg-yellow-500 text-black font-semibold py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Ingresar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Hotel Gil. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
