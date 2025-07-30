"use client" 
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Stored plan shape in localStorage
type Plan = {
  projectId?: string; // may be missing in older saves
  tasks: string[];
  projectContext: { description: string; stylePrompt: string };
  finalImageUrl: string | null;
  timestamp: string;
};

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // Next.js now passes params as a Promise
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem("allProjectPlans");
      const plans: Plan[] = raw ? JSON.parse(raw) : [];

      // Primary: id is the position in the array (user requirement)
      const n = Number(id);
      let chosen: Plan | null = Number.isFinite(n) ? (plans[n - 1] ?? null) : null; // 1-based index

      // Fallback: if not found, try by stored projectId (for future saves)
      if (!chosen) {
        chosen = plans.find(p => p.projectId === id) ?? null;
      }

      setPlan(chosen);
    } catch (e) {
      console.error("Error reading localStorage", e);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-100">Loading…</div>;
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-white px-4">
        <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
        <p className="mb-6">No hay un plan con id <span className="font-mono">{id}</span> en este navegador.</p>
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
        <Button
          asChild                 // let the button render whatever is inside
          className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(158,158,149,0.7)] hover:brightness-110 transition-all duration-200"
          style={{
            background: 'rgba(158, 158, 149, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow:
              '2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: '20px',
          }}
        >
          <Link href="/">⬅ Volver al Inicio</Link>
        </Button>
          <div className="mt-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-50">
              {plan.projectContext.description || "Proyecto sin título"}
            </h1>
            <p className="text-sm text-gray-400 mt-2">Índice local: {id}</p>
          </div>
        </header>

        <main>
          <section className="p-6 rounded-lg border border-white/10 bg-black/20 space-y-4">
            <p><span className="font-medium">Estilo:</span> {plan.projectContext.stylePrompt}</p>

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
              <img src={plan.finalImageUrl} alt="Imagen del proyecto" className="rounded-lg border border-white/10 mt-6" />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
