"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"
import { useTranslations } from "next-intl"

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
    <section className="min-h-screen text-white py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">{t("title")}</h2>
        <p className="text-gray-400 mb-10">{t("description")}</p>

        <div className="flex flex-col gap-8">
          {mockTasks.map((task) => (
            <article
              key={task.id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all shadow-md transition-opacity duration-300"
            >
              <div className="relative w-full h-64">
                <Image
                  src={task.image}
                  alt={task.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{task.title}</h3>
                <p className="text-sm text-gray-400 mb-1">
                  👤 {t("employer")}: <span className="text-white">{task.employer}</span>
                </p>
                <p className="text-sm text-gray-400 mb-1">
                  📅 {t("createdAtAndTasks", {
                    createdAt: task.createdAt,
                    tasksCount: task.tasksCount,
                  })}
                </p>
                <p className="text-sm text-gray-300 mb-4">
                  🎯 {t("focus")}: {task.focus}
                </p>
                <Button
                  className="w-full"
                  variant="secondary"
                  disabled={loadingId === task.id}
                  onClick={() => handleSendProposal(task)}
                >
                  {loadingId === task.id ? t("sending") : t("sendProposal")}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
