"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function EstoyTrabajando() {
  const mockTasks = [
    {
      id: 1,
      title: "Landing page para producto SaaS",
      employer: "@acme",
      createdAt: "25 Jul 2025",
      focus: "Diseño UX/UI",
      tasksCount: 3,
      image: "/placeholder.svg", // asegúrate que esta imagen existe
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
                <p className="text-sm text-gray-400 mb-1">👤 Empleador: <span className="text-white">{task.employer}</span></p>
                <p className="text-sm text-gray-400 mb-1">📅 {task.createdAt} · 🧩 {task.tasksCount} tareas</p>
                <p className="text-sm text-gray-300 mb-4">🎯 Enfoque: {task.focus}</p>
                <Button className="w-full" variant="secondary">Aplicar</Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
