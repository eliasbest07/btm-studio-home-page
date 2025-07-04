
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditProjectClientProps {
  projectId: number;
  initialIsPublic: boolean;
}

export default function EditProjectClient({ projectId, initialIsPublic }: EditProjectClientProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const togglePrivacy = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/proyectos/${projectId}/toggle-privacy`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar la privacidad.');
      }

      const result = await response.json();
      setIsPublic(result.newStatus);
      // Refrescamos la página para asegurar que los datos del servidor se actualicen si es necesario
      router.refresh(); 

    } catch (error) {
      console.error(error);
      // Aquí podrías mostrar una notificación de error (toast)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
    className="text-white px-4 py-2 font-semibold rounded-xl hover:bg-[rgba(198,198,199,1)] hover:brightness-110 transition-all duration-200"
          style={{
            background: `rgba(158, 158, 149, 0.2)`,
            // Removed invalid hover property
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow:
              '2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: '20px',
          }}
    onClick={togglePrivacy} variant="outline" disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isPublic ? (
        <Unlock className="h-4 w-4 mr-2" />
      ) : (
        <Lock className="h-4 w-4 mr-2" />
      )}
      {isPublic ? 'Hacer Privado' : 'Hacer Público'}
    </Button>
  );
}
