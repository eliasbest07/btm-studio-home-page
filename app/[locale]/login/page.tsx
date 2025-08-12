"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2, Lock } from "lucide-react";
import { saveUserData } from "@/app/utils/userSession";

export default function Login() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg("");

    const { data: loginData, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    const userId = loginData.user.id;
    const { data: userData, error: userError } = await supabase
      .from("usuario")
      .select("*")
      .eq("id_usuario", userId)
      .single();

    if (userError || !userData) {
      setErrorMsg(`No se encontraron datos del usuario en la base de datos. ${userError || ""}`);
      console.error("Error fetching user data:", userError);
      setIsLoading(false);
      return;
    }

    // Guarda login + userData y emite evento para que Header se refresque
    localStorage.setItem("loggedIn", "true");
    saveUserData({
      nombre: userData.nombre,
      idea: userData.idea,
      avatar: userData.avatar,
      role: userData.role,
      correo: userData.correo,
      admin: userData.admin,
    });

    router.replace("/"); // navegación limpia
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div
        className="p-8 w-80 flex flex-col items-center"
        style={{
          background: "rgba(158, 158, 149, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow:
            "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          borderRadius: "20px",
        }}
      >
        <h2 className="text-white text-2xl mb-6">Iniciar sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-md bg-gray-900/30 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-md bg-gray-900/30 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          disabled={isLoading}
        />

        {errorMsg && <p className="text-red-400 mb-4">{errorMsg}</p>}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="flex items-center justify-center w-full px-4 py-2 font-semibold text-white rounded-xl hover:bg-[rgba(198,198,199,1)] hover:brightness-110 transition-all duration-200"
          style={{
            background: "rgba(158, 158, 149, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow:
              "2px 4px 4px rgba(0, 0, 0, 0.35), inset -1px 0px 2px rgba(201, 201, 201, 0.1), inset 5px -5px 12px rgba(255, 255, 255, 0.05), inset -5px 5px 12px rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            borderRadius: "20px",
          }}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Lock className="h-5 w-5 mr-2" />}
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}
