"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import {
  User,
  Camera,
  Save,
  ArrowLeft,
  Mail,
  Calendar,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Upload,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PersonalSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    birthDate: ""
  });

  const supabase = createClientComponentClient();

  const glassmorphismStyle = {
    background: "rgba(158, 158, 149, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow:
      "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Populate form with existing user data
        setFormData({
          fullName: session.user.user_metadata?.full_name || "",
          username: session.user.user_metadata?.username || "",
          email: session.user.email || "",
          bio: session.user.user_metadata?.bio || "",
          location: session.user.user_metadata?.location || "",
          website: session.user.user_metadata?.website || "",
          github: session.user.user_metadata?.github || "",
          linkedin: session.user.user_metadata?.linkedin || "",
          birthDate: session.user.user_metadata?.birth_date || ""
        });
        setAvatarPreview(session.user.user_metadata?.avatar_url || "");
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Here you would typically upload the avatar and update user metadata
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Upload avatar to storage if avatarFile exists
      // 2. Update user metadata with formData
      // 3. Handle success/error states
      
      console.log("Saving user data:", formData);
      console.log("Avatar file:", avatarFile);
      
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white p-3 sm:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-3 py-4 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      {/* Header */}
      <div
        className="p-4 sm:p-6 rounded-xl text-white relative overflow-hidden"
        style={glassmorphismStyle}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            href="/profile/settings"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Datos Personales
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Actualiza tu información personal y perfil público
            </p>
          </div>
        </div>
      </div>

      {/* Avatar Section */}
      <div
        className="p-4 sm:p-6 rounded-xl text-white"
        style={glassmorphismStyle}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Foto de Perfil
        </h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              )}
            </div>
            {avatarPreview && (
              <button
                onClick={removeAvatar}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-gray-300 mb-3">
              Sube una foto de perfil. Se recomienda una imagen cuadrada de al menos 200x200px.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto text-black hover:text-white border-white/20 hover:bg-white/10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Imagen
                </Button>
              </label>
              {avatarPreview && (
                <Button
                  onClick={removeAvatar}
                  variant="outline"
                  className="w-full sm:w-auto text-red-400 border-red-400/30 hover:bg-red-500/20"
                >
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div
        className="p-4 sm:p-6 rounded-xl text-white"
        style={glassmorphismStyle}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Información Básica
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre Completo
            </label>
            <Input
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Tu nombre completo"
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre de Usuario
            </label>
            <Input
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="tu_usuario"
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Correo Electrónico
            </label>
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="tu@email.com"
              type="email"
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha de Nacimiento
            </label>
            <Input
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              type="date"
              className="bg-black/20 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Ubicación
            </label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Ciudad, País"
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Biografía
            </label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div
        className="p-4 sm:p-6 rounded-xl text-white"
        style={glassmorphismStyle}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Enlaces Sociales
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Sitio Web
            </label>
            <Input
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://tu-sitio-web.com"
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </label>
            <Input
              value={formData.github}
              onChange={(e) => handleInputChange("github", e.target.value)}
              placeholder="tu-usuario-github"
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </label>
            <Input
              value={formData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              placeholder="tu-perfil-linkedin"
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div
        className="p-4 sm:p-6 rounded-xl text-white"
        style={glassmorphismStyle}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
          
          <Link href="/profile/settings">
            <Button
              variant="outline"
              className="w-full sm:w-auto text-black hover:text-white border-white/20 hover:bg-white/10"
            >
              Cancelar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}