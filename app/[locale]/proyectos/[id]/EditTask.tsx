'use client';

import { useState } from 'react';

interface EditTaskProps {
  tarea: {
    id: number;
    descripcion: string;
    estado: string;
  };
}

export default function EditTask({ tarea }: EditTaskProps) {
  const [descripcion, setDescripcion] = useState(tarea.descripcion);
  const [estado, setEstado] = useState(tarea.estado);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleSave = async () => {
    setGuardando(true);
    setMensaje('');
    try {
      const res = await fetch(`/api/tareas/${tarea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, estado }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al guardar los cambios');

      setMensaje('✅ Tarea actualizada correctamente');
    } catch (err: any) {
      console.error(err);
      setMensaje(`❌ ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="p-3 bg-white/5 rounded-md border border-white/10 space-y-2">
      <input
        className="w-full bg-transparent border border-white/20 px-2 py-1 rounded-md text-white"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <select
        className="w-full bg-transparent border border-white/20 px-2 py-1 rounded-md text-white"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="pendiente">Pendiente</option>
        <option value="completada">Completada</option>
      </select>

      <button
        onClick={handleSave}
        disabled={guardando}
        className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md"
      >
        {guardando ? 'Guardando...' : 'Guardar'}
      </button>

      {mensaje && <p className="text-sm text-yellow-300 mt-2">{mensaje}</p>}
    </div>
  );
}
