"use client"

import Link from "next/link"
import { GithubIcon, LinkedinIcon, LanguagesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const t = useTranslations("footer")
   const router = useRouter()
  const pathname = usePathname()

 const toggleLanguage = () => {
    const newLocale = pathname.startsWith("/es") ? "en" : "es"
    const newPath = pathname.replace(/^\/(es|en)/, `/${newLocale}`)
    router.push(newPath)
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
      <div className="container py-6 mx-auto flex flex-col gap-6 md:flex-row justify-between items-center gap-6 text-gray-300">
        <p className="text-sm">&copy; {currentYear} BTM-Studio. {t("rights")}</p>
        <div className="flex gap-4 items-center">
          <Link
            href="https://github.com/eliasbest07"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon className="h-5 w-5 hover:text-white transition-colors" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/elias-montilla-629110229"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
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
          {t("language")}
        </Button>
      </div>
    </footer>
  )
}
