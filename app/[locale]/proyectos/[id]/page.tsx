"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Lock, Unlock, Loader2 } from "lucide-react";
import { useProjectPrivacy } from "@/hooks/useProjectPrivacy";

type ProjectContext = {
  description: string;
  stylePrompt: string;
  type: string;
  utility: string;
  palette: string;
  colors: string[] | null;
};

type Plan = {
  projectId?: string;
  tasks: string[];
  projectContext: ProjectContext;
  finalImageUrl: string | null;
  timestamp: string;
  publico?: boolean; // Asegúrate que está aquí para lectura
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Estados y funciones del hook inicializados con valores temporales
  const [hookParams, setHookParams] = React.useState<{ projectId: string; initialPublic: boolean } | null>(null);

  // Solo inicializamos el hook cuando ya tenemos el plan con projectId y publico
  const privacyHook = useProjectPrivacy(hookParams?.projectId ?? "", hookParams?.initialPublic ?? false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem("allProjectPlans");
      const plans: Plan[] = raw ? JSON.parse(raw) : [];

      const n = Number(id);
      let chosen: Plan | null = Number.isFinite(n)
        ? plans[n - 1] ?? null
        : null;

      if (!chosen) {
        chosen = plans.find((p) => p.projectId === id) ?? null;
      }

      setPlan(chosen);
      if (chosen && chosen.projectId) {
        // Pasamos projectId y estado publico al hook
        setHookParams({ projectId: chosen.projectId, initialPublic: chosen.publico ?? false });
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-100">
        Loading…
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-white px-4">
        <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
        <p className="mb-6">
          No hay un plan con id <span className="font-mono">{id}</span> en este navegador.
        </p>
        <Button asChild>
          <Link href="/plan">Crear un nuevo plan</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <Button
              asChild
              className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(158,158,149,0.7)] hover:brightness-110 transition-all duration-200"
              style={{
                background: "rgba(158, 158, 149, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow:
                  "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                borderRadius: "20px",
              }}
            >
              <Link href="/">⬅ Volver al Inicio</Link>
            </Button>

            <div>
              <Button
                className="text-black flex items-center"
                onClick={privacyHook.togglePrivacy}
                disabled={privacyHook.isLoading}
                variant="outline"
              >
                {privacyHook.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : privacyHook.isPublic ? (
                  <Lock className="h-4 w-4 mr-2" />
                ) : (
                  <Unlock className="h-4 w-4 mr-2" />
                )}
                {privacyHook.isPublic ? "Hacer Privado" : "Hacer Público"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-50">
              {plan.projectContext.description || "Proyecto sin título"}
            </h1>
            <p className="text-sm text-gray-400">Índice local: {id}</p>

            <Button
              className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(158,158,149,0.7)] hover:brightness-110 transition-all duration-200"
              style={{
                background: "rgba(158, 158, 149, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow:
                  "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                borderRadius: "20px",
              }}
              onClick={() => {
                /* Función editar */
              }}
              variant="outline"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </header>

        <main>
          <section className="p-6 rounded-lg border border-white/10 bg-black/20 space-y-4">
            <p>
              <span className="font-medium">Estilo:</span>{" "}
              {plan.projectContext.stylePrompt}
            </p>

            <h2 className="text-2xl font-semibold">Tareas</h2>
            {plan.tasks?.length ? (
              <ul className="list-disc ml-5 space-y-1">
                {plan.tasks.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">Sin tareas.</p>
            )}

            {plan.finalImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={plan.finalImageUrl}
                alt="Imagen del proyecto"
                className="rounded-lg border border-white/10 mt-6"
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
