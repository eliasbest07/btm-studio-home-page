"use client"

import Link from "next/link"
import { GithubIcon, TwitterIcon, LinkedinIcon, LanguagesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
// En una implementación real, usarías un hook de una librería de i18n
// import { useTranslation } from 'next-i18next';

export default function Footer() {
  const currentYear = new Date().getFullYear()
  // Simulación simple de cambio de idioma
  const toggleLanguage = () => {
    alert("Active Google Trasnlate to change language")
  }

  return (
    <footer
      className="w-full mt-auto"
      style={{
        background: "rgba(25, 25, 22, 0.5)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-300">
        <p className="text-sm">&copy; {currentYear} BTM Studio. Todos los derechos reservados.</p>
        <div className="flex gap-4 items-center">
          <Link href="https://github.com/eliasbest07" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <GithubIcon className="h-5 w-5 hover:text-white transition-colors" />
          </Link>
          
        
          <Link href="https://www.linkedin.com/in/elias-montilla-629110229" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <LinkedinIcon className="h-5 w-5 hover:text-white transition-colors" />
          </Link>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLanguage}
          className="bg-transparent border-gray-500 text-gray-300 hover:bg-white/10 hover:text-white"
        >
          <LanguagesIcon className="h-4 w-4 mr-2" />
          English
        </Button>
      </div>
    </footer>
  )
}
