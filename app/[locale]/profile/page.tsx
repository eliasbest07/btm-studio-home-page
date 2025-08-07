'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'

export default function PerfilPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [usuario, setUsuario] = useState({
    nombre: '',
    idea: '',
    avatar: '',
    correo: '',
  })

  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('userData')
    console.log('Datos del usuario en perfil:', data)
    if (data) {
      const parsed = JSON.parse(data)
      setUsuario({
        nombre: parsed.nombre || '',
        idea: parsed.idea || '',
        avatar: parsed.avatar || '',
        correo: parsed.correo || '',
      })
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    const { error } = await supabase
      .from('usuario')
      .update({
        nombre: usuario.nombre,
        idea: usuario.idea,
        avatar: usuario.avatar,
      })
      .eq('correo', usuario.correo)

    if (!error) {
      localStorage.setItem('userData', JSON.stringify(usuario))
      setEditMode(false)
    } else {
      alert('Error al guardar')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    router.push('/login')
  }

  return (
    <div className="max-w-xl mx-auto p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Perfil del Usuario</h1>

      {usuario.avatar && (
        <img
          src={usuario.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full mb-6 border border-gray-300"
        />
      )}

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={handleInputChange}
            disabled={!editMode}
            className="w-full p-2 rounded-md bg-gray-900 bg-opacity-30 border border-gray-700 text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Idea</label>
          <input
            type="text"
            name="idea"
            value={usuario.idea}
            onChange={handleInputChange}
            disabled={!editMode}
            className="w-full p-2 rounded-md bg-gray-900 bg-opacity-30 border border-gray-700 text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Avatar (URL)</label>
          <input
            type="text"
            name="avatar"
            value={usuario.avatar}
            onChange={handleInputChange}
            disabled={!editMode}
            className="w-full p-2 rounded-md bg-gray-900 bg-opacity-30 border border-gray-700 text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Correo</label>
          <input
            type="text"
            value={usuario.correo}
            disabled
            className="w-full p-2 rounded-md bg-gray-900 bg-opacity-30 border border-gray-700 text-white"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        {editMode ? (
          <Button onClick={handleSave}>Guardar</Button>
        ) : (
          <Button onClick={() => setEditMode(true)}>Editar</Button>
        )}
        <Button variant="destructive" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
