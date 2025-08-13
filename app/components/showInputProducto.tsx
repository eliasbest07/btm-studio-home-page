"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCheckModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (producto: string) => Promise<void> | void;
}

export default function ProductCheckModal({
  isOpen,
  onOpenChange,
  onSave,
}: ProductCheckModalProps) {
  const supabase = useMemo(() => createClientComponentClient(), []);
  const [value, setValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [exists, setExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setValue("");
      setExists(null);
      setError(null);
      setIsChecking(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced check (2s) against proyectos.producto
  useEffect(() => {
    if (!isOpen) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value.trim()) {
      setExists(null);
      setIsChecking(false);
      setError(null);
      return;
    }

    setIsChecking(true);
    setError(null);

    timerRef.current = setTimeout(async () => {
      try {
        const { count, error: sbError } = await supabase
          .from("proyectos")
          .select("id", { count: "exact", head: true })
          .eq("producto", value.trim());

        if (sbError) throw sbError;
        setExists((count ?? 0) > 0);
      } catch (e: any) {
        setError(e?.message || "Unexpected error");
        setExists(null);
      } finally {
        setIsChecking(false);
      }
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, supabase, isOpen]);

  // Space => "-" (preserve caret)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      const next = el.value.slice(0, start) + "-" + el.value.slice(end);
      setValue(next);
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(start + 1, start + 1);
      });
    }
  };

  // Normalize spaces on paste/type
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value.replace(/\s+/g, "-"));
  };

  const canSave = !!value.trim() && exists === false && !isChecking;

  const handleSave = async () => {
    if (!canSave) return;
    try {
      // Llama a onSave y espera su resultado, retornando el valor validado
      const result = await onSave?.(value.trim());
      onOpenChange(false);
      return value.trim();
    } catch (e: any) {
      setError(e?.message || "Could not save. Please try again.");
    }
  };

  // Glass style to match your Plan UI
  const glassStyle = {
    background: "rgba(30, 30, 28, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow:
      "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    borderRadius: "20px",
  } as const;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 border" style={glassStyle}>
        <div className="p-6 space-y-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-gray-100">Añadir clave de producto</DialogTitle>
            <DialogDescription className="text-gray-300">
              Escribe tu identificador. La barra espaciadora inserta “-”. Comprobamos
              disponibilidad tras 2&nbsp;segundos de inactividad.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Producto</label>
            <Input
              ref={inputRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="mi-clave-de-producto"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="bg-white/10 border-white/20 text-sm text-gray-100 focus:ring-gray-400"
            />

            {/* Status */}
            <div className="h-6 flex items-center gap-2 text-sm">
              {isChecking && (
                <span className="inline-flex items-center gap-2 text-gray-300">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Comprobando…
                </span>
              )}
              {!isChecking && exists === false && (
                <span className="inline-flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Disponible
                </span>
              )}
              {!isChecking && exists === true && (
                <span className="inline-flex items-center gap-2 text-red-400">
                  <XCircle className="h-4 w-4" />
                  Ya en uso
                </span>
              )}
              {!isChecking && exists === null && !error && value.trim() === "" && (
                <span className="text-gray-400">Esperando entrada…</span>
              )}
              {error && <span className="text-red-400">Error: {error}</span>}
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-white"
              style={glassStyle}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!canSave}
              className={cn("text-white disabled:opacity-40", !canSave ? "" : "hover:brightness-110")}
              style={{ ...glassStyle, background: "rgba(34, 197, 94, 0.3)" }} // green-500/30
            >
              Guardar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
