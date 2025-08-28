"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import {
  User,
  Lock,
  ChevronRight,
  Settings as SettingsIcon,
  Trash2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      setUser(session?.user || null);
      if (session?.user) {
        await fetchUserProfile();
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/get-user');
      const data = await response.json();
      
      if (response.ok) {
        setUserProfile(data.user.profile);
      } else {
        console.error('Error fetching user profile:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const userName = userProfile?.nombre || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';

  const settingsCategories = [
    {
      title: "Cuenta",
      description: "Gestiona tu información personal y seguridad",
      icon: User,
      items: [
        {
          title: "Datos personales",
          description: "Cambia tu nombre, bio y avatar",
          icon: User,
          href: "/profile/settings/personal",
          color: "text-blue-400"
        },
        {
          title: "Cambiar contraseña",
          description: "Actualiza tu contraseña de forma segura",
          icon: Lock,
          href: "/profile/settings/password",
          color: "text-green-400"
        },


      ]
    }

  ];

  if (loading) {
    return (
      <div className="min-h-screen text-white p-3 sm:p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white px-3 py-4 sm:p-6 space-y-4 sm:space-y-8 overflow-x-hidden">
      {/* Header */}
      <div
        className="p-4 sm:p-8 rounded-xl sm:rounded-2xl text-white relative overflow-hidden"
        style={glassmorphismStyle}
      >
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <SettingsIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Configuración
              </h1>
              <p className="text-gray-300 text-sm sm:text-lg mt-1">
                Personaliza tu experiencia, {userName}
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements - hidden on mobile */}
        <div className="absolute top-4 right-4 opacity-20 hidden sm:block">
          <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600"></div>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="space-y-6 sm:space-y-8">
        {settingsCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-3 sm:space-y-4">
            {/* Category Header */}
            <div
              className="p-4 sm:p-6 rounded-xl text-white"
              style={glassmorphismStyle}
            >
              <div className="flex items-center gap-3">
                <category.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    {category.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Items */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {category.items.map((item, itemIndex) => (
                <Link key={itemIndex} href={item.href} className="block">
                  <div
                    className="p-4 sm:p-6 rounded-xl text-white hover:brightness-110 hover:scale-[1.02] transition-all duration-200 group"
                    style={glassmorphismStyle}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className={`p-2 sm:p-3 rounded-lg bg-black/20 ${item.color}`}>
                          <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-medium text-white">
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-300 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div className="space-y-3 sm:space-y-4">
          <div
            className="p-4 sm:p-6 rounded-xl text-white border border-red-500/30"
            style={{
              ...glassmorphismStyle,
              background: "rgba(239, 68, 68, 0.1)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Zona de peligro
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 mt-1">
                  Acciones irreversibles para tu cuenta
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar cuenta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
