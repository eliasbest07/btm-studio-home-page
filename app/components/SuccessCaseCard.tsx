"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts" // Cambiado a LineChart
import { Button } from "@/components/ui/button"
import { ExternalLinkIcon } from "lucide-react"
import type { SuccessCase } from "@/app/data/success-cases-data"

interface SuccessCaseCardProps {
  project: SuccessCase
  cardHeight?: number
  cardWidth?: number
  cardColor?: string
  cardOffset?: number
}

export default function SuccessCaseCard({
  project,
  cardHeight = 520,
  cardWidth = 360,
  cardColor = "rgba(41, 41, 38, 0.75)",
  cardOffset = 0,
}: SuccessCaseCardProps) {
  const cardStyle: React.CSSProperties = {
    height: `${cardHeight}px`,
    width: `${cardWidth}px`,
    background: cardColor,
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow:
      "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    borderRadius: "20px",
    marginLeft: `${cardOffset}px`,
    marginTop: `${cardOffset}px`,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    color: "#E5E7EB",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  }

  const progressData = project.progressData || [
    { name: "Q1", value: project.investment * 0.5 },
    { name: "Q2", value: project.investment * 1.2 },
    { name: "Q3", value: project.investment * 0.9 },
    { name: "Q4", value: project.returnValue },
  ] // Fallback si no hay datos

  return (
    <div
      style={cardStyle}
      className="group hover:translate-y-[-5px] hover:scale-[1.03] hover:shadow-[4px_8px_12px_rgba(0,0,0,0.4),_inset_-1px_0px_2px_rgba(201,201,201,0.1),_inset_5px_-5px_12px_rgba(255,255,255,0.05),_inset_-5px_5px_12px_rgba(255,255,255,0.05)]"
    >
      <div className="relative w-full h-40 mb-3 rounded-md overflow-hidden">
        <Image
          src={project.imageUrl || "/placeholder.svg"}
          alt={`Imagen de ${project.name}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h3 className="text-xl font-bold mb-1 text-center text-gray-50">{project.name}</h3>
      {project.startYear && <p className="text-xs text-gray-400 text-center mb-1.5">Iniciado en {project.startYear}</p>}
      <p className="text-sm text-gray-300 mb-2 text-center flex-grow overflow-y-auto max-h-[60px] custom-scrollbar px-1">
        {project.description}
      </p>

      <div className="my-2 text-center space-y-0.5">
        <p className="text-sm">
          <span className="font-semibold text-gray-200">Inversión:</span> ${project.investment.toLocaleString()}
        </p>
        <p className="text-sm">
          <span className="font-semibold text-gray-200">
            Retorno {project.returnIsMonthly ? "Mensual Estimado" : "Anual Estimado"}:
          </span>{" "}
          ${project.returnValue.toLocaleString()}
        </p>
        {project.roiPercentage !== undefined && ( // Comprobar si existe, incluso si es 0
          <p className="text-base font-bold text-green-400">
            ROI Estimado: {project.roiPercentage.toLocaleString()}%
            {project.returnIsMonthly && (
              <span className="text-xs font-normal text-gray-400"> (vs. inversión inicial)</span>
            )}
          </p>
        )}
      </div>

      <div className="w-full h-36 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#A0AEC0" }} />
            <YAxis
              tickFormatter={(value) => (value >= 1000 ? `$${value / 1000}k` : `$${value}`)}
              tick={{ fontSize: 10, fill: "#A0AEC0" }}
              width={50}
              domain={["auto", "auto"]} // Para que se ajuste bien a los picos
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Progreso"]}
              contentStyle={{
                backgroundColor: "rgba(30, 30, 30, 0.85)",
                borderColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "#E5E7EB",
              }}
              labelStyle={{ color: "#E5E7EB", fontWeight: "bold" }}
              itemStyle={{ color: "#82ca9d" }} // Color de la línea en el tooltip
            />
            <Legend
              verticalAlign="top"
              height={20}
              iconType="plainline"
              wrapperStyle={{ fontSize: "10px", color: "#A0AEC0" }}
              formatter={() => "Evolución Estimada"}
            />
            <Line
              type="monotone" // Para curvas suaves
              dataKey="value"
              stroke="#82ca9d" // Un verde agradable
              strokeWidth={2}
              dot={{ r: 3, fill: "#82ca9d", strokeWidth: 1, stroke: "rgba(30,30,30,0.85)" }}
              activeDot={{ r: 5, fill: "#82ca9d", stroke: "white" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {project.linkUrl && project.linkText && (
        <div className="mt-auto pt-3 text-center">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-gray-100/10 hover:bg-gray-100/20 text-gray-200 border-gray-400/50 hover:text-white"
          >
            <Link href={project.linkUrl} target="_blank" rel="noopener noreferrer">
              {project.linkText}
              <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
