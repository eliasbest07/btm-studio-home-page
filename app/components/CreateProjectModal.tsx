"use client";

import { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageCarousel, { type CarouselImageItem } from "./ImageCarousel";
import { generateTasksAction } from "@/app/actions/openai-actions";
import { Loader2, Plus } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

interface CreateProjectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProjectModal({
  isOpen,
  onOpenChange,
}: CreateProjectModalProps) {
  const t = useTranslations("createProjectModal");
  const router = useRouter();
  const pathname = usePathname();

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const [projectDescription, setProjectDescription] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<CarouselImageItem | null>(
    null
  );
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [projectType, setProjectType] = useState<string>(
    t("projectTypes.taskList")
  );
  const [projectUtility, setProjectUtility] = useState("");
  const [selectedPalette, setSelectedPalette] = useState<string | null>(
    "ninguna"
  );
  const [customColors, setCustomColors] = useState<string[]>([
    "#ffffff",
    "#000000",
    "#cccccc",
  ]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = async () => {
    if (newTask.trim()) {
      const taskObj = {
        id: Date.now(),
        title: newTask.trim(),
        description: "",
        isManual: true,
        completed: false,
      };

      try {
        // Crear el planData con solo la tarea manual
        const planData = {
          tasks: [taskObj], // Solo la tarea que se acaba de agregar
          projectContext: {
            description: "Proyecto Vacio",
            stylePrompt: selectedStyle?.prompt || "Sin estilo",
            type: "Sin tipo definido",
            utility: "Sin utilidad definida",
            palette: "Sin paleta definida",
            colors: selectedPalette === "personalizada"
  ? customColors
  : colorPalettes.find(p => p.name === selectedPalette)?.colors || []

          },
          suggestionId: null,
        };

        // Guardar en sessionStorage y navegar
        sessionStorage.setItem("projectPlanData", JSON.stringify(planData));
        onOpenChange(false);
        console.log(pathname);
        if (pathname === "/en/plan" || pathname === "/es/plan") {
          window.location.reload(); // fuerza recarga si ya estás en /plan
        } else {
          router.push("/plan"); // redirige normalmente
        }
      } catch (error) {
        console.error("Error al agregar tarea:", error);
        // Manejar error si es necesario
      }
    }
  };

  const projectTypes = [
    t("projectTypes.taskList"),
    t("projectTypes.webApp"),
    t("projectTypes.landingPage"),
    t("projectTypes.mobileApp"),
    t("projectTypes.automation"),
  ];
  const styleInspirations: CarouselImageItem[] = [
    {
      src: "/minimalist-neutral.webp",
      alt: t("style.names.minimalistNeutral"),
      prompt: t("style.prompts.minimalistNeutral"),
    },
    {
      src: "/dark-modern-tech.webp",
      alt: t("style.names.darkModernTech"),
      prompt: t("style.prompts.darkModernTech"),
    },
    {
      src: "/vibrant-playful.webp",
      alt: t("style.names.vibrantPlayful"),
      prompt: t("style.prompts.vibrantPlayful"),
    },
    {
      src: "/elegant-luxury.webp",
      alt: t("style.names.elegantLuxury"),
      prompt: t("style.prompts.elegantLuxury"),
    },
    {
      src: "/eco-natural.webp",
      alt: t("style.names.ecoNatural"),
      prompt: t("style.prompts.ecoNatural"),
    },
    {
      src: "/retro-futuristic.webp",
      alt: t("style.names.retroFuturistic"),
      prompt: t("style.prompts.retroFuturistic"),
    },
  ];

  const colorPalettes = [
    { name: "Minimalista", colors: ["#f5f5f4", "#d4d4d4", "#a3a3a3"] },
    {
      name: "Oscuro Neón",
      colors: ["#0f172a", "#1e293b", "#22d3ee", "#a78bfa"],
    },
    {
      name: "Tropical Vibrante",
      colors: ["#f59e0b", "#10b981", "#ec4899", "#f87171"],
    },
    { name: "Lujoso", colors: ["#111827", "#78350f", "#facc15"] },
    {
      name: "Natural Suave",
      colors: ["#a3b18a", "#588157", "#dad7cd", "#344e41"],
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        descriptionRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleImageSelection = (item: CarouselImageItem) => {
    if (item.alt === "Ningún estilo") {
      setSelectedStyle(null);
    } else if (selectedStyle?.alt === item.alt) {
      setSelectedStyle(null);
    } else {
      setSelectedStyle(item);
    }
    setErrorMessage(null);
  };

  const handleContinue = async () => {
    if (projectDescription.trim() === "") {
      setErrorMessage(t("errors.descriptionMissing"));
      return;
    }

    setErrorMessage(null);
    setIsGeneratingTasks(true);

    try {
      const result = await generateTasksAction(
        projectType,
        projectUtility,
        projectDescription,
        selectedStyle?.prompt || ""
      );

      // Convertir las tareas del resultado a objetos Task
      const processedTasks = (result.tasks || []).map((task, index) => {
        if (typeof task === "string") {
          return {
            id: `generated-${Date.now()}-${index}`,
            title: task,
            description: "",
            isManual: false,
            completed: false,
          };
        }
      });

      const planData = {
        tasks: processedTasks, // Ahora son objetos Task
        projectContext: {
          description: projectDescription,
          stylePrompt: selectedStyle?.prompt || "",
           type: projectType,
          utility: projectUtility,
          palette: selectedPalette,
          colors: selectedPalette === "personalizada"
  ? customColors
  : colorPalettes.find(p => p.name === selectedPalette)?.colors || []

        },
        suggestionId: result.suggestionId || null,
      };

      sessionStorage.setItem("projectPlanData", JSON.stringify(planData));
      
      onOpenChange(false);
      if (pathname === "/en/plan" || pathname === "/es/plan") {
        window.location.reload(); // fuerza recarga si ya estás en /plan
      } else {
        router.push("/plan"); // redirige normalmente
      }
    } catch (error) {
      console.error("Error llamando a OpenAI:", error);
      setErrorMessage(t("errors.generationFailed"));

      const planData = {
        tasks: [], // Array vacío de objetos Task
        projectContext: {
          description: projectDescription,
          stylePrompt: selectedStyle?.prompt || "",
          type: projectType,
          utility: projectUtility,
          palette: selectedPalette,
          colors: selectedPalette === "personalizada"
  ? customColors
  : colorPalettes.find(p => p.name === selectedPalette)?.colors || []

        },
        suggestionId: null,
      };

      sessionStorage.setItem("projectPlanData", JSON.stringify(planData));
      onOpenChange(false);
      console.log(pathname);
      if (pathname === "/en/plan" || pathname === "/es/plan") {
        window.location.reload(); // fuerza recarga si ya estás en /plan
      } else {
        router.push("/plan"); // redirige normalmente
      }
    } finally {
      setIsGeneratingTasks(false);
    }
  };
  const handleCloseThisModal = (open: boolean) => {
    if (!open) {
      setProjectDescription("");
      setSelectedStyle(null);
      setErrorMessage(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseThisModal}>
      <DialogContent
        className="sm:max-w-2xl md:max-w-3xl text-gray-100 border-glass-border flex flex-col"
        style={{
          background: "rgba(30, 30, 28, 0.9)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          maxHeight: "90vh",
        }}
      >
        <DialogHeader className="flex-shrink-0 px-6 pt-6">
          <DialogTitle className="text-2xl font-bold text-center text-gray-50">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-300 pb-2">
            {t("subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto px-6 custom-scrollbar">
          <div className="grid gap-6 py-4">
            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {t("projectType.label")}
              </label>
              <div className="flex flex-wrap gap-3">
                {projectTypes.map((type) => (
                  <div
                    key={type}
                    onClick={() => setProjectType(type)}
                    className={`cursor-pointer px-4 py-2 rounded-full border text-sm ${
                      projectType === type
                        ? "bg-white text-gray-900 border-white"
                        : "bg-white/5 text-gray-200 border-white/20 hover:bg-white/10"
                    } transition-colors duration-150`}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>

            {/* Project Utility */}
            <div>
              <label
                htmlFor="projectUtility"
                className="block text-sm font-medium text-gray-200 mb-1.5"
              >
                {t("utility.label")}{" "}
                <span className="text-gray-400 italic text-xs">
                  ({t("utility.optional")})
                </span>
              </label>
              <Textarea
                id="projectUtility"
                placeholder={t("utility.placeholder")}
                value={projectUtility}
                onChange={(e) => setProjectUtility(e.target.value)}
                rows={3}
                className="resize-none bg-white/5 focus:ring-yellow-400 text-gray-100 placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div className="rounded-xl bg-white/10 border border-yellow-400/30 p-4 shadow-md transition-shadow hover:shadow-yellow-500/10">
              <label
                htmlFor="projectDescription"
                className="block text-sm font-medium text-yellow-300 mb-1.5"
              >
                {t("description.label")}
              </label>
              <Textarea
                ref={descriptionRef}
                id="projectDescription"
                placeholder={t("description.placeholder")}
                value={projectDescription}
                onChange={(e) => {
                  setProjectDescription(e.target.value);
                  setErrorMessage(null);
                }}
                rows={7}
                className="resize-none bg-white/5 focus:ring-yellow-400 border border-yellow-500/20 text-gray-100 placeholder:text-yellow-200 transition-all duration-200"
              />
              {projectType && (
                <p className="text-xs text-yellow-200 mt-1 ml-1">
                  {t("description.selectedProject")}{" "}
                  <span className="text-yellow-100 font-semibold">
                    {projectType}
                  </span>
                </p>
              )}
            </div>

            {/* Palette Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {t("palette.label")}
              </label>
              <div className="flex flex-wrap gap-4">
                {/* None */}
                <div
                  className={`cursor-pointer rounded-xl px-4 py-2 border-2 transition-all ${
                    selectedPalette === "ninguna"
                      ? "border-yellow-400"
                      : "border-transparent hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedPalette("ninguna")}
                >
                  <p className="text-sm text-gray-300">{t("palette.none")}</p>
                </div>

                {/* Predefined */}
                {colorPalettes.map((palette) => (
                  <div
                    key={palette.name}
                    className={`cursor-pointer rounded-xl p-1 border-2 transition-all ${
                      selectedPalette === palette.name
                        ? "border-yellow-400"
                        : "border-transparent hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedPalette(palette.name)}
                  >
                    <div className="flex space-x-1 rounded-lg overflow-hidden">
                      {palette.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-center mt-1 text-gray-300">
                      {t(`palette.names.${palette.name}`)}
                    </p>
                  </div>
                ))}

                {/* Custom */}
                <div
                  className={`cursor-pointer rounded-xl p-2 border-2 transition-all ${
                    selectedPalette === "personalizada"
                      ? "border-yellow-400"
                      : "border-transparent hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedPalette("personalizada")}
                >
                  <div className="flex space-x-1">
                    {customColors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-center mt-1 text-gray-300">
                    {t("palette.custom")}
                  </p>
                </div>
              </div>

              {selectedPalette === "personalizada" && (
                <div className="mt-3 flex gap-3 flex-wrap">
                  {customColors.map((color, idx) => (
                    <input
                      key={idx}
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newColors = [...customColors];
                        newColors[idx] = e.target.value;
                        setCustomColors(newColors);
                      }}
                      className="w-10 h-10 rounded border border-gray-400"
                    />
                  ))}
                  {customColors.length < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        setCustomColors([...customColors, "#888888"])
                      }
                      className="text-xs text-gray-200 underline hover:text-yellow-400"
                    >
                      {t("palette.addColor")}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                {t("style.label")}
              </label>
              <ImageCarousel
                items={[
                  {
                    src: t("style.noneImageSrc"),
                    alt: "Ningún estilo",
                    prompt: "",
                  },
                  ...styleInspirations,
                ]}
                options={{ slidesToScroll: 1 }}
                onImageSelect={handleImageSelection}
                itemsToShow={4}
              />
              {selectedStyle ? (
                <div className="mt-3 p-3 bg-white/5 rounded-md border border-white/10">
                  <p className="text-xs text-gray-300">
                    <span className="font-semibold text-gray-100">
                      {t("style.selected")}:
                    </span>{" "}
                    {selectedStyle.alt}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    <span className="font-semibold text-gray-200">
                      {t("style.prompt")}:
                    </span>{" "}
                    {selectedStyle.prompt}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-2">
                  {t("style.noneSelected")}
                </p>
              )}
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="text-sm text-red-400 text-center mt-2">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-end gap-2 flex-shrink-0 px-6 pb-6 pt-4 border-t border-white/10">
          {/* Input para añadir tareas */}
          <div className="flex gap-2 mb-4 items-center w-full">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="Añadir tarea"
              className="flex-1 min-w-0 h-10 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={handleAddTask}
              disabled={!newTask.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium h-10 px-4 rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
              Añadir Tarea
            </Button>
            <Button
              type="button"
              onClick={handleContinue}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 h-10 px-4 rounded-lg flex-shrink-0"
              disabled={isGeneratingTasks || projectDescription.trim() === ""}
            >
              {isGeneratingTasks ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("continueButton")
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
