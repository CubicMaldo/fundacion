import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

export { isSupabaseConfigured } from "@/integrations/supabase/client";

export type UserRole = "admin" | "editor" | "docente" | "estudiante";

export interface UserProfile {
  id: string;
  email: string;
  nombre_completo: string | null;
  rol: UserRole;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isEditor: boolean;
  isDocente: boolean;
  isEstudiante: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string, roleHint?: UserRole) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredAuth(): { user: User; profile: UserProfile } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("funasf_auth_session");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setStoredAuth(user: User | null, profile: UserProfile | null) {
  if (typeof window === "undefined") return;
  try {
    if (user && profile) {
      localStorage.setItem("funasf_auth_session", JSON.stringify({ user, profile }));
    } else {
      localStorage.removeItem("funasf_auth_session");
    }
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getStoredAuth()?.user ?? null);
  const [profile, setProfile] = useState<UserProfile | null>(
    () => getStoredAuth()?.profile ?? null,
  );
  const [isLoading, setIsLoading] = useState(() => !getStoredAuth()?.user);
  const configured = isSupabaseConfigured();

  const fetchProfile = useCallback(
    async (userId: string, userEmail: string): Promise<UserProfile> => {
      try {
        const { data, error } = await supabase
          .from("perfiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (error || !data) {
          // Principio de mínimo privilegio: por defecto rol estudiante, nunca admin
          const fallbackProfile: UserProfile = {
            id: userId,
            email: userEmail,
            nombre_completo: userEmail.split("@")[0] ?? "Usuario",
            rol: "estudiante",
            avatar_url: null,
          };
          return fallbackProfile;
        }

        return {
          id: data.id,
          email: data.email,
          nombre_completo: data.nombre_completo,
          rol: (data.rol as UserRole) || "estudiante",
          avatar_url: data.avatar_url,
        };
      } catch {
        return {
          id: userId,
          email: userEmail,
          nombre_completo: userEmail.split("@")[0] ?? "Usuario",
          rol: "estudiante",
          avatar_url: null,
        };
      }
    },
    [],
  );

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.id, user.email ?? "");
    setProfile(p);
    setStoredAuth(user, p);
  }, [user, fetchProfile]);

  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      if (!configured) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          setUser(session.user);
          const p = await fetchProfile(session.user.id, session.user.email ?? "");
          if (isMounted) {
            setProfile(p);
            setStoredAuth(session.user, p);
          }
        }
      } catch (err) {
        console.warn("[Auth] No se pudo inicializar sesión:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initSession();

    if (!configured) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setUser(session.user);
        const p = await fetchProfile(session.user.id, session.user.email ?? "");
        if (isMounted) {
          setProfile(p);
          setStoredAuth(session.user, p);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setStoredAuth(null, null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [configured, fetchProfile]);

  const signIn = async (
    email: string,
    password: string,
    roleHint?: UserRole,
  ): Promise<{ error?: string }> => {
    if (configured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return {
            error:
              error.message === "Invalid login credentials"
                ? "Credenciales incorrectas. Verifica tu correo y contraseña."
                : error.message,
          };
        }

        if (data.user) {
          setUser(data.user);
          const p = await fetchProfile(data.user.id, data.user.email ?? "");
          setProfile(p);
          setStoredAuth(data.user, p);
          return {};
        }

        return { error: "No se pudo obtener la sesión del usuario." };
      } catch (err) {
        return { error: (err as Error).message || "Error al conectar con el servidor de autenticación." };
      }
    }

    // Si Supabase NO está configurado:
    // Solo permitir modo demostración en entorno local de desarrollo explícito (Vite DEV)
    if (import.meta.env.DEV) {
      const isEstudianteDemo =
        roleHint === "estudiante" ||
        email.toLowerCase().includes("estudiante") ||
        email.toLowerCase().includes("alumno");

      const fallbackRole: UserRole = isEstudianteDemo ? "estudiante" : (roleHint ?? "admin");
      const fallbackName = isEstudianteDemo ? "Estudiante FUNASF (Demo)" : "Administrador FUNASF (Demo)";
      const fallbackId = isEstudianteDemo ? "demo-estudiante-id" : "admin-session-id";

      const fallbackUser = {
        id: fallbackId,
        email,
        app_metadata: {},
        user_metadata: { nombre_completo: fallbackName, rol: fallbackRole },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;

      const fallbackProfile: UserProfile = {
        id: fallbackId,
        email,
        nombre_completo: fallbackName,
        rol: fallbackRole,
        avatar_url: null,
      };

      setUser(fallbackUser);
      setProfile(fallbackProfile);
      setStoredAuth(fallbackUser, fallbackProfile);
      return {};
    }

    // En producción, bloquear acceso si Supabase no está configurado
    return {
      error:
        "El servicio de autenticación no está disponible en este momento. Por favor contacta al administrador.",
    };
  };

  const signOut = async () => {
    if (configured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("[Auth] Error al cerrar sesión:", err);
      }
    }
    setUser(null);
    setProfile(null);
    setStoredAuth(null, null);
  };

  const role = profile?.rol ?? null;
  const isAdmin = role === "admin";
  const isEditor = role === "editor" || isAdmin;
  const isDocente = role === "docente" || isAdmin;
  const isEstudiante = role === "estudiante";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isEditor,
        isDocente,
        isEstudiante,
        isLoading,
        isConfigured: configured,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
