"use client";
import { useState, useCallback, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

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
};

export function useProjectPrivacy(id: string, initialPublic: boolean = false) {
  const supabaseClient = createClientComponentClient();
  const router = useRouter();

  const [isPublic, setIsPublic] = useState(initialPublic);
  const [isLoading, setIsLoading] = useState(false);

  const visibilityKey = `project-${id}-visibility`;

  // Cargar estado inicial desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem(visibilityKey);
    if (stored !== null) {
      setIsPublic(stored === "public");
    } else {
      setIsPublic(initialPublic);
    }
  }, [visibilityKey, initialPublic]);

  const togglePrivacy = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        alert("Debes iniciar sesión para cambiar la visibilidad del proyecto.");
        setIsLoading(false);
        router.push("/login");
        return;
      }

      // Solo enviar projectId y nuevo estado publico para actualizar privacidad
      const newState = !isPublic;

      const response = await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          publico: newState,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Error al guardar la visibilidad.");
        setIsLoading(false);
        return;
      }

      setIsPublic(newState);
      localStorage.setItem(visibilityKey, newState ? "public" : "private");
    } catch (error) {
      console.error(error);
      alert("Error al cambiar la visibilidad.");
    } finally {
      setIsLoading(false);
    }
  }, [id, isPublic, supabaseClient, router, visibilityKey]);

  return {
    isPublic,
    isLoading,
    togglePrivacy,
  };
}
