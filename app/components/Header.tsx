"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import CreateProjectModal from "./CreateProjectModal"
import { useTranslations } from "next-intl"

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const t = useTranslations("header")

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(25, 25, 22, 0.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <nav className="container mx-auto flex justify-between items-center h-16 px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/btm-studio-logo.png"
              alt="BTM Studio Logo - Diamante y Orbes Abstractos"
              width={36}
              height={36}
              className="rounded-md"
            />
            <span className="font-bold text-lg text-gray-100">BTM Studio</span>
          </Link>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-2.5"
          >
            {t("createProject")}
          </Button>
        </nav>
      </header>
      <CreateProjectModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
