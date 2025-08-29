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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
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
    twitter: "",
    birthDate: ""
  });

  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileError, setProfileError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const supabase = createClientComponentClient();

  // Function to upload avatar using API
  const uploadAvatar = async (file: File): Promise<string | null> => {
    setUploadingAvatar(true);
    try {
      console.log("🔄 Subiendo avatar via API...", file.name);
      
      // Create FormData
      const formData = new FormData();
      formData.append('avatar', file);

      // Upload via API
      const response = await fetch('../../api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Avatar subido exitosamente:", data.avatarUrl);
        return data.avatarUrl;
      } else {
        console.error("❌ Error subiendo avatar:", data.error);
        throw new Error(data.error || "Error desconocido al subir la imagen");
      }

    } catch (error: any) {
      console.error("💥 Error crítico subiendo avatar:", error);
      setProfileError(error.message || "Error desconocido al subir la imagen");
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

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
        await fetchUserProfile();
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('../../api/get-user');
      const data = await response.json();

      if (response.ok) {
        const profile = data.user.profile;
        setUserProfile(profile);

        // Populate form with data from database
        setFormData({
          fullName: profile.nombre || "",
          username: profile.username || "",
          email: profile.correo || user?.email || "",
          bio: profile.bio || "",
          location: profile.ubicacion || "",
          website: profile.enlace_web || "",
          github: profile.enlace_github || "",
          linkedin: profile.enlace_linkedin || "",
          twitter: "", // No está en el esquema actual
          birthDate: profile.fecha_nacimiento || ""
        });
        setAvatarPreview(profile.avatar || "");
        setProfileError("");
      } else {
        console.error('Error fetching user profile:', data.error);
        setProfileError(data.error);

        // Fallback to auth metadata if profile doesn't exist
        if (data.code === 'USER_NOT_FOUND' && user) {
          setFormData({
            fullName: user.user_metadata?.full_name || "",
            username: user.user_metadata?.username || "",
            email: user.email || "",
            bio: user.user_metadata?.bio || "",
            location: user.user_metadata?.location || "",
            website: user.user_metadata?.website || "",
            github: user.user_metadata?.github || "",
            linkedin: user.user_metadata?.linkedin || "",
            twitter: user.user_metadata?.twitter || "",
            birthDate: user.user_metadata?.birth_date || ""
          });
          setAvatarPreview(user.user_metadata?.avatar_url || "");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setProfileError("Error de conexión al obtener el perfil");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("🔍 handleAvatarChange triggered");
    const file = e.target.files?.[0];
    
    if (file) {
      console.log("📁 Archivo seleccionado:", file.name, file.size, file.type);
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setProfileError("La imagen es demasiado grande. Máximo 5MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setProfileError("El archivo debe ser una imagen.");
        return;
      }

      setProfileError(""); // Clear any previous errors
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log("✅ Preview generado, tamaño:", result.length);
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("❌ No se seleccionó ningún archivo");
    }
  };

  const removeAvatar = async () => {
    try {
      // If there's a current avatar in the profile, delete it from storage
      if (userProfile?.avatar) {
        await deleteAvatarFromStorage(userProfile.avatar);
        
        // Update profile to remove avatar
        const response = await fetch('../../api/get-user', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avatar: null
          }),
        });

        if (response.ok) {
          console.log("✅ Avatar eliminado del perfil");
        }
      }
      
      setAvatarFile(null);
      setAvatarPreview("");
    } catch (error) {
      console.error("Error eliminando avatar:", error);
    }
  };

  // Function to delete avatar from storage (optional)
  const deleteAvatarFromStorage = async (avatarUrl: string) => {
    try {
      if (!avatarUrl || !avatarUrl.includes('avatars/')) return;
      
      // Extract file path from URL
      const urlParts = avatarUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `avatars/${fileName}`;

      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) {
        console.error("⚠️ Error eliminando avatar del storage:", error);
      } else {
        console.log("✅ Avatar eliminado del storage:", filePath);
      }
    } catch (error) {
      console.error("💥 Error crítico eliminando avatar:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setProfileError("");
    setSuccessMessage("");

    try {
      // Upload avatar first if there's a new file
      let avatarUrl = avatarPreview;
      if (avatarFile) {
        console.log("🔄 Subiendo avatar para nuevo perfil:", avatarFile.name);
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
          setAvatarPreview(uploadedUrl);
          setAvatarFile(null); // Clear the file after successful upload
          console.log("✅ Avatar subido para nuevo perfil:", uploadedUrl);
        } else {
          setSaving(false);
          return;
        }
      }

      // Si no existe perfil, crear uno nuevo
      if (!userProfile) {
        const response = await fetch('../../api/get-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.fullName,
            username: formData.username,
            bio: formData.bio,
            ubicacion: formData.location,
            fecha_nacimiento: formData.birthDate,
            enlace_github: formData.github,
            enlace_web: formData.website,
            enlace_linkedin: formData.linkedin,
            avatar: avatarUrl,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setUserProfile(data.user.profile);
          setProfileError("");
          setSuccessMessage("✅ Perfil creado exitosamente");
          console.log("Perfil creado exitosamente");

          // Auto-hide success message after 5 seconds
          setTimeout(() => setSuccessMessage(""), 5000);
        } else {
          setProfileError(data.error);
        }
      } else {
        // Actualizar perfil existente
        console.log("Actualizando perfil existente:", formData);

        // Upload avatar if a new file was selected
        let avatarUrl = avatarPreview;
        if (avatarFile) {
          console.log("🔄 Subiendo nuevo avatar:", avatarFile.name);
          
          // Delete old avatar if exists
          if (userProfile?.avatar && userProfile.avatar !== avatarPreview) {
            await deleteAvatarFromStorage(userProfile.avatar);
          }
          
          const uploadedUrl = await uploadAvatar(avatarFile);
          if (uploadedUrl) {
            avatarUrl = uploadedUrl;
            setAvatarPreview(uploadedUrl);
            setAvatarFile(null); // Clear the file after successful upload
            console.log("✅ Avatar subido, nueva URL:", uploadedUrl);
          } else {
            setSaving(false);
            return;
          }
        }

        const response = await fetch('../../api/get-user', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.fullName,
            username: formData.username,
            bio: formData.bio,
            ubicacion: formData.location,
            fecha_nacimiento: formData.birthDate,
            enlace_github: formData.github,
            enlace_web: formData.website,
            enlace_linkedin: formData.linkedin,
            avatar: avatarUrl
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setUserProfile(data.user.profile);
          setProfileError("");
          setSuccessMessage(`✅ Perfil actualizado exitosamente (${data.updatedFields?.join(', ')})`);
          console.log("✅ Perfil actualizado exitosamente:", data.updatedFields);

          // Auto-hide success message after 5 seconds
          setTimeout(() => setSuccessMessage(""), 5000);
        } else {
          console.error("❌ Error actualizando perfil:", data.error);
          setProfileError(data.error);
        }
      }

    } catch (error) {
      console.error("Error saving:", error);
      setProfileError("Error al guardar los cambios");
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

        {/* Error Message */}
        {profileError && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{profileError}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">{successMessage}</p>
          </div>
        )}
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
              {uploadingAvatar ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                  <span className="text-xs text-white">Subiendo...</span>
                </div>
              ) : avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              )}
            </div>
            {avatarPreview && !uploadingAvatar && (
              <button
                onClick={removeAvatar}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-gray-300 mb-2">
              Sube una foto de perfil. Se recomienda una imagen cuadrada de al menos 200x200px.
            </p>
            <p className="text-xs text-gray-400 mb-3">
              Formatos: JPG, PNG, GIF. Tamaño máximo: 5MB.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  document.getElementById('avatar-upload')?.click();
                }}
                className="w-full sm:w-auto text-black hover:text-white border-white/20 hover:bg-white/10"
                disabled={uploadingAvatar}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadingAvatar ? "Subiendo..." : "Subir Imagen"}
              </Button>

              {avatarPreview && (
                <Button
                  onClick={removeAvatar}
                  variant="outline"
                  className="w-full sm:w-auto text-red-400 border-red-400/30 hover:bg-red-500/20"
                  disabled={uploadingAvatar}
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
            disabled={saving || uploadingAvatar}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : uploadingAvatar ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Subiendo imagen...
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