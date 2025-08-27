"use client";

import { Button } from "@/components/ui/button";
import { Eye, Lock, Unlock, Calendar } from "lucide-react";
import Link from "next/link";

interface Project {
  id: number;
  nombre: string;
  description: string;
  publico?: boolean;
  timestamp?: string;
  imagen_url?: string;
  producto?: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  const glassmorphismStyle = {
    background: "rgba(158, 158, 149, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow:
      "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  };

  return (
    <div
      className="p-6 rounded-xl text-white hover:scale-105 transition-all duration-300 group cursor-pointer"
      style={glassmorphismStyle}
    >
      {/* Imagen del proyecto si existe */}
      {project.imagen_url && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img 
            src={project.imagen_url} 
            alt={project.nombre}
            className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="space-y-4">
        {/* Header con título y estado */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-white line-clamp-2 flex-1">
            {project.nombre}
          </h3>
          <div className="flex items-center gap-2 ml-3">
            {project.publico !== undefined && (
              project.publico ? (
                <Unlock className="h-4 w-4 text-green-400" />
              ) : (
                <Lock className="h-4 w-4 text-blue-400" />
              )
            )}
          </div>
        </div>
        
        {/* Descripción */}
        <p className="text-gray-300 text-sm line-clamp-3">
          {project.description}
        </p>
        
        {/* Footer con fecha y botón */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          {project.timestamp && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Calendar className="h-3 w-3" />
              {new Date(project.timestamp).toLocaleDateString()}
            </div>
          )}
          
          <Button
            asChild
            size="sm"
            className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-lg ml-auto"
          >
            <Link href={`/proyectos/${project.producto || project.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Proyecto
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
