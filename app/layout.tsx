import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Image from "next/image"
import "./globals.css"
import Header from "./components/Header" // Import Header here to make it part of the layout
import Footer from "./components/Footer" // Importar el Footer

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BTM Studio - Soluciones Creativas",
  description: "Bienvenido a BTM Studio, creando experiencias digitales innovadoras.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} text-gray-100`}>
        {/* Contenedor para la imagen de fondo y el overlay */}
        <div className="fixed inset-0 -z-20">
          <Image
            src="/images/background-clouds.webp"
            alt="Cielo dramático con nubes y sol brillante como fondo global"
            fill
            style={{ objectFit: "cover" }}
            quality={80}
            priority
          />
          {/* Overlay oscuro global para mejorar la legibilidad del texto */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Contenedor principal para el contenido que se desplaza */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header /> {/* Header ahora es parte del layout global */}
          <main className="flex-grow">{children}</main>
          <Footer /> {/* Añadir el Footer al layout global */}
        </div>
      </body>
    </html>
  )
}
