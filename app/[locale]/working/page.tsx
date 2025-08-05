"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"
import { useTranslations } from "next-intl"
import TaskCards from "@/app/components/task-cards-component"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EstoyTrabajando() {
  const t = useTranslations("working") // hook de next-intl para traducciones
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const mockTasks = [
    {
      id: 1,
      title: "Landing page para producto SaaS",
      employer: "@acme",
      createdAt: "25 Jul 2025",
      focus: "Diseño UX/UI",
      tasksCount: 3,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      title: "Dashboard analítico para ecommerce",
      employer: "@storemax",
      createdAt: "24 Jul 2025",
      focus: "React + Tailwind + API REST",
      tasksCount: 5,
      image: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Chatbot para soporte técnico",
      employer: "@helpbot",
      createdAt: "23 Jul 2025",
      focus: "Integración IA + Backend",
      tasksCount: 2,
      image: "/placeholder.svg",
    },
  ]

  const handleSendProposal = async (task: typeof mockTasks[0]) => {
    setLoadingId(task.id)

    const { error } = await supabase
      .from("bloque")
      .insert([
        {
          user_email: "jesus_diaz_parra7@hotmail.com",
          title: "taskss",
          description: `Propuesta para: Elias`,
          day: 2,
          start_hour: 9,
          end_hour: 10,
          color: "#a3b18a",
          status: "pendiente",
          assigned: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error al enviar propuesta:", error)
      alert(t("proposalError"))
    } else {
      alert(t("proposalSent"))
    }

    setLoadingId(null)
  }

  return (
    <div className="min-h-screen text-white ">
 
      <TaskCards/>
   
    </div>
  )
}
