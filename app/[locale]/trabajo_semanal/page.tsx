"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido.",
  }),
  whatsapp: z.string().min(10, {
    message: "Por favor ingresa un número de WhatsApp válido.",
  }),
  horario: z.enum(["manana", "tarde"], {
    required_error: "Por favor selecciona un horario.",
  }),
});

export default function TrabajoSemanalPage() {
  const t = useTranslations("TrabajoSemanal");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      whatsapp: "",
      horario: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/trabajo-semanal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
      } else {
        console.error("Error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      {/* Header */}
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-xl mb-4">
          {t("title")}
        </h1>
        <p className="text-lg text-gray-300 mt-3 max-w-3xl mx-auto drop-shadow-lg">
          {t("subtitle")}
        </p>
      </header>

      <div className="max-w-6xl mx-auto">
        {/* Job Description Section */}
        <section className="mb-12">
          <div
            className="p-8 rounded-3xl"
            style={{
              background: "rgba(158, 158, 149, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow:
                "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              💼 {t("description.title")}
            </h2>
            <p className="text-gray-200 mb-6 leading-relaxed">
              {t("description.intro")}
            </p>

            <div className="space-y-6">
              {/* Customer Service */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t("description.customerService.title")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-200 ml-4">
                  <li>{t("description.customerService.item1")}</li>
                  <li>{t("description.customerService.item2")}</li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t("description.socialMedia.title")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-200 ml-4">
                  <li>{t("description.socialMedia.item1")}</li>
                  <li>{t("description.socialMedia.item2")}</li>
                </ul>
              </div>

              {/* Manuals and Videos */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t("description.content.title")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-200 ml-4">
                  <li>{t("description.content.item1")}</li>
                  <li>{t("description.content.item2")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="mb-12">
          <div
            className="p-8 rounded-3xl"
            style={{
              background: "rgba(158, 158, 149, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow:
                "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              ⚙️ {t("requirements.title")}
            </h2>
            <ul className="list-disc list-inside space-y-3 text-gray-200 ml-4">
              <li>{t("requirements.item1")}</li>
              <li>{t("requirements.item2")}</li>
              <li>{t("requirements.item3")}</li>
              <li>{t("requirements.item4")}</li>
            </ul>
          </div>
        </section>

        {/* Desired Skills Section */}
        <section className="mb-12">
          <div
            className="p-8 rounded-3xl"
            style={{
              background: "rgba(158, 158, 149, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow:
                "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              🌟 {t("skills.title")}
            </h2>
            <ul className="list-disc list-inside space-y-3 text-gray-200 ml-4">
              <li>{t("skills.item1")}</li>
              <li>{t("skills.item2")}</li>
              <li>{t("skills.item3")}</li>
            </ul>
          </div>
        </section>

        {/* Application Form */}
        <section>
          <div
            className="p-8 rounded-3xl"
            style={{
              background: "rgba(158, 158, 149, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow:
                "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              📝 {t("form.title")}
            </h2>

            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {t("form.successTitle")}
                </h3>
                <p className="text-gray-200">{t("form.successMessage")}</p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6"
                  variant="outline"
                >
                  {t("form.submitAnother")}
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          {t("form.nombre")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.nombrePlaceholder")}
                            {...field}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          {t("form.email")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("form.emailPlaceholder")}
                            {...field}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          {t("form.whatsapp")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.whatsappPlaceholder")}
                            {...field}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="horario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          {t("form.horario")}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue
                                placeholder={t("form.horarioPlaceholder")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manana">
                              {t("form.manana")}
                            </SelectItem>
                            <SelectItem value="tarde">
                              {t("form.tarde")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? t("form.sending") : t("form.submit")}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
