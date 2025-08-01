import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define los idiomas soportados
export const locales = ['es', 'en'] as const;

export default getRequestConfig(async ({ locale }) => {
  // Validar que el locale es compatible
  if (!locales.includes(locale as any)) notFound();

  return {ss
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});