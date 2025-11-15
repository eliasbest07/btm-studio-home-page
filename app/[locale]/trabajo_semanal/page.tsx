"use client";

import { useTranslations, useLocale } from "next-intl";
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
import { CheckCircle2 } from "lucide-react";
import ShapeCaptcha from "@/app/components/ShapeCaptcha";

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
});

export default function TrabajoSemanalPage() {
  const t = useTranslations("TrabajoSemanal");
  const locale = useLocale();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasDuplicateError, setHasDuplicateError] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      whatsapp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage(null);
    setHasDuplicateError(false);

    try {
      const response = await fetch("/api/trabajo-semanal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          locale,
          captchaVerified: captchaSolved,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
        setCaptchaSolved(false);
        setErrorMessage(null);
        setHasDuplicateError(false);
      } else {
        // Mostrar mensaje de error
        setErrorMessage(data.error || "Error al enviar el formulario");

        // Detectar si es un error de duplicado (409 Conflict)
        if (response.status === 409) {
          setHasDuplicateError(true);
        }

        // Si el error es de un campo específico, establecer el error en ese campo
        if (data.field) {
          form.setError(data.field as "email" | "whatsapp", {
            type: "manual",
            message: data.error,
          });
        }

        console.error("Error al enviar el formulario:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(
        locale === "es"
          ? "Error de conexión. Por favor intenta de nuevo."
          : "Connection error. Please try again."
      );
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
                  onClick={() => {
                    setIsSubmitted(false);
                    setErrorMessage(null);
                    setHasDuplicateError(false);
                  }}
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
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <p className="text-red-300 text-sm">
                        ⚠️ {errorMessage}
                      </p>
                    </div>
                  )}

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
                            onChange={(e) => {
                              field.onChange(e);
                              // Limpiar error de duplicado cuando el usuario cambia el email
                              if (hasDuplicateError) {
                                setHasDuplicateError(false);
                                setErrorMessage(null);
                              }
                            }}
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
                            onChange={(e) => {
                              field.onChange(e);
                              // Limpiar error de duplicado cuando el usuario cambia el whatsapp
                              if (hasDuplicateError) {
                                setHasDuplicateError(false);
                                setErrorMessage(null);
                              }
                            }}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CAPTCHA */}
                  <div className="mt-8">
                    <ShapeCaptcha
                      onSuccess={() => setCaptchaSolved(true)}
                      locale={locale}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !captchaSolved || hasDuplicateError}
                  >
                    {isLoading ? t("form.sending") : t("form.submit")}
                  </Button>

                  {!captchaSolved && !hasDuplicateError && (
                    <p className="text-center text-yellow-300 text-sm">
                      {locale === "es"
                        ? "⚠️ Completa la verificación de seguridad para enviar el formulario"
                        : "⚠️ Complete the security verification to submit the form"
                      }
                    </p>
                  )}

                  {hasDuplicateError && (
                    <p className="text-center text-red-300 text-sm font-semibold">
                      {locale === "es"
                        ? "⚠️ Por favor corrige el error antes de enviar nuevamente"
                        : "⚠️ Please fix the error before submitting again"
                      }
                    </p>
                  )}
                </form>
              </Form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
