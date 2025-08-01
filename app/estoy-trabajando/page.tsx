"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EstoyTrabajando() {
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

    const { data, error } = await supabase
      .from("bloque")
      .insert([
        {
          user_email: "jesus_diaz_parra7@hotmail.com",
          title: "taskss",
          description: `Propuesta para: Elias`,
         day: 2, // Esto da "2025-07-30T03:11:08.172Z
          start_hour: 9,
          end_hour: 10,
          color: "#a3b18a", // Mock color
          status: "pendiente",
          assigned: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Error al enviar propuesta:", error)
      alert("Ocurrió un error al enviar la propuesta.")
    } else {
      alert("✅ Propuesta enviada correctamente.")
    }

    setLoadingId(null)
  }

  return (
    <section className="min-h-screen text-white py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">🛠️ Estoy trabajando</h2>
        <p className="text-gray-400 mb-10">Estas son las últimas tareas ofertadas por empleadores.</p>

        <div className="flex flex-col gap-8">
          {mockTasks.map((task) => (
            <motion.article
              key={task.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: task.id * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all shadow-md"
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
                  👤 Empleador: <span className="text-white">{task.employer}</span>
                </p>
                <p className="text-sm text-gray-400 mb-1">
                  📅 {task.createdAt} · 🧩 {task.tasksCount} tareas
                </p>
                <p className="text-sm text-gray-300 mb-4">🎯 Enfoque: {task.focus}</p>
                <Button
                  className="w-full"
                  variant="secondary"
                  disabled={loadingId === task.id}
                  onClick={() => handleSendProposal(task)}
                >
                  {loadingId === task.id ? "Enviando..." : "Enviar propuesta"}
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
