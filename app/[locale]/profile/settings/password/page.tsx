"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import {
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    Save,
    Shield,
    CheckCircle,
    XCircle,
    AlertCircle,
    Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordRequirement {
    text: string;
    met: boolean;
}

export default function PasswordSettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Form data
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
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

    // Password requirements validation
    const passwordRequirements: PasswordRequirement[] = [
        {
            text: "Al menos 8 caracteres",
            met: passwords.new.length >= 8
        },
        {
            text: "Una letra mayúscula",
            met: /[A-Z]/.test(passwords.new)
        },
        {
            text: "Una letra minúscula",
            met: /[a-z]/.test(passwords.new)
        },
        {
            text: "Un número",
            met: /\d/.test(passwords.new)
        },
        {
            text: "Un carácter especial (!@#$%^&*)",
            met: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.new)
        }
    ];

    const passwordsMatch = passwords.new === passwords.confirm && passwords.confirm !== "";
    const allRequirementsMet = passwordRequirements.every(req => req.met);
    const canSubmit = passwords.current && passwords.new && passwords.confirm && allRequirementsMet && passwordsMatch;

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoading(false);
        };

        getUser();
    }, []);

    const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
        setPasswords(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear messages when user starts typing
        if (error) setError("");
        if (success) setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canSubmit) return;

        setSaving(true);
        setError("");

        try {
            // Simulate API call - in real implementation, use Supabase auth
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In a real implementation:
            // const { error } = await supabase.auth.updateUser({
            //   password: passwords.new
            // });

            // if (error) throw error;

            setSuccess(true);
            setPasswords({ current: "", new: "", confirm: "" });

            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);

        } catch (error: any) {
            setError(error.message || "Error al cambiar la contraseña");
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
                            Cambiar Contraseña
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-300 mt-1">
                            Actualiza tu contraseña para mantener tu cuenta segura
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div
                    className="p-4 rounded-xl border border-green-500/30"
                    style={{
                        ...glassmorphismStyle,
                        background: "rgba(34, 197, 94, 0.1)",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <div>
                            <p className="text-green-400 font-medium">¡Contraseña actualizada!</p>
                            <p className="text-green-300 text-sm mt-1">
                                Tu contraseña se ha cambiado exitosamente.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div
                    className="p-4 rounded-xl border border-red-500/30"
                    style={{
                        ...glassmorphismStyle,
                        background: "rgba(239, 68, 68, 0.1)",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                        <div>
                            <p className="text-red-400 font-medium">Error</p>
                            <p className="text-red-300 text-sm mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Info */}
            <div
                className="p-4 sm:p-6 rounded-xl text-white"
                style={glassmorphismStyle}
            >
                <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-white mb-2">Consejos de Seguridad</h3>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Usa una contraseña única que no uses en otros sitios</li>
                            <li>• Combina letras, números y símbolos</li>
                            <li>• Evita información personal como nombres o fechas</li>
                            <li>• Considera usar un gestor de contraseñas</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Current Password */}
                <div
                    className="p-4 sm:p-6 rounded-xl text-white"
                    style={glassmorphismStyle}
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Contraseña Actual
                    </h2>

                    <div className="relative">
                        <Input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwords.current}
                            onChange={(e) => handlePasswordChange("current", e.target.value)}
                            placeholder="Ingresa tu contraseña actual"
                            className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 pr-12"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div
                    className="p-4 sm:p-6 rounded-xl text-white"
                    style={glassmorphismStyle}
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Nueva Contraseña
                    </h2>

                    <div className="space-y-4">
                        <div className="relative">
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                value={passwords.new}
                                onChange={(e) => handlePasswordChange("new", e.target.value)}
                                placeholder="Ingresa tu nueva contraseña"
                                className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {/* Password Requirements */}
                        {passwords.new && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-300">Requisitos de contraseña:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {passwordRequirements.map((requirement, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            {requirement.met ? (
                                                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                            )}
                                            <span className={`text-xs ${requirement.met ? 'text-green-400' : 'text-gray-400'}`}>
                                                {requirement.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Confirm Password */}
                <div
                    className="p-4 sm:p-6 rounded-xl text-white"
                    style={glassmorphismStyle}
                >
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Confirmar Nueva Contraseña
                    </h2>

                    <div className="space-y-3">
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwords.confirm}
                                onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                                placeholder="Confirma tu nueva contraseña"
                                className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {/* Password Match Indicator */}
                        {passwords.confirm && (
                            <div className="flex items-center gap-2">
                                {passwordsMatch ? (
                                    <>
                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                        <span className="text-xs text-green-400">Las contraseñas coinciden</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-4 w-4 text-red-400" />
                                        <span className="text-xs text-red-400">Las contraseñas no coinciden</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div
                    className="p-4 sm:p-6 rounded-xl text-white"
                    style={glassmorphismStyle}
                >
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <Button
                            type="submit"
                            disabled={!canSubmit || saving}
                            className={`w-full sm:w-auto font-semibold px-6 py-3 ${canSubmit
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Cambiando...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Cambiar Contraseña
                                </>
                            )}
                        </Button>

                        <Link href="/profile/settings">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto text-red-400 border-red-400/30 hover:bg-red-500/20 hover:text-red-300"
                            >
                                Cancelar
                            </Button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}