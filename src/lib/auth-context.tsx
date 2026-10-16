import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

export { isSupabaseConfigured } from "@/integrations/supabase/client";

export const LOGIN_EMAIL_DOMAIN = "usuarios.edufunasf.org";

export type UserRole = "admin" | "editor" | "docente" | "estudiante";

export interface UserProfile {
  id: string;
  email: string;
  nombre_completo: string | null;
  rol: UserRole;
  avatar_url: string | null;
  usuario?: string | null;
  documento?: string | null;
  telefono?: string | null;
  activo: boolean;
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
  signIn: (identifier: string, password: string, roleHint?: UserRole) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateOwnAccount: (params: {
    password?: string | undefined;
    telefono?: string | undefined;
    nombre_completo?: string | undefined;
  }) => Promise<{ ok: boolean; error?: string }>;
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
          // Principio de mínimo privilegio: por defecto rol estudiante
          const fallbackProfile: UserProfile = {
            id: userId,
            email: userEmail,
            nombre_completo: userEmail.split("@")[0] ?? "Usuario",
            rol: "estudiante",
            avatar_url: null,
            usuario: userEmail.split("@")[0] ?? null,
            activo: true,
          };
          return fallbackProfile;
        }

        return {
          id: data.id,
          email: data.email,
          nombre_completo: data.nombre_completo,
          rol: (data.rol as UserRole) || "estudiante",
          avatar_url: data.avatar_url,
          usuario: data.usuario ?? null,
          documento: data.documento ?? null,
          telefono: data.telefono ?? null,
          activo: data.activo ?? true,
        };
      } catch {
        return {
          id: userId,
          email: userEmail,
          nombre_completo: userEmail.split("@")[0] ?? "Usuario",
          rol: "estudiante",
          avatar_url: null,
          activo: true,
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
            if (p.activo === false) {
              await supabase.auth.signOut();
              setUser(null);
              setProfile(null);
              setStoredAuth(null, null);
            } else {
              setProfile(p);
              setStoredAuth(session.user, p);
            }
          }
        } else if (isMounted) {
          setUser(null);
          setProfile(null);
          setStoredAuth(null, null);
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
          if (p.activo === false) {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setStoredAuth(null, null);
          } else {
            setProfile(p);
            setStoredAuth(session.user, p);
          }
        }
      } else {
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
    identifier: string,
    password: string,
    roleHint?: UserRole,
  ): Promise<{ error?: string }> => {
    const raw = identifier.trim();
    if (!raw) return { error: "Ingresa tu usuario o correo electrónico." };
    if (!password) return { error: "Ingresa tu contraseña." };

    // Resolver identificador (email directo, o buscar por usuario/documento vía RPC seguro)
    let emailToUse = raw.includes("@") ? raw.toLowerCase() : `${raw.toLowerCase()}@${LOGIN_EMAIL_DOMAIN}`;

    if (configured) {
      try {
        if (!raw.includes("@")) {
          const { data: resolvedEmail } = await supabase.rpc("resolver_email_login", {
            p_identificador: raw.toLowerCase(),
          });
          if (resolvedEmail) {
            emailToUse = resolvedEmail;
          }
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password,
        });

        if (error) {
          return {
            error:
              error.message === "Invalid login credentials"
                ? "Credenciales incorrectas. Verifica tu documento/usuario y contraseña."
                : error.message,
          };
        }

        if (data.user) {
          const p = await fetchProfile(data.user.id, data.user.email ?? "");
          if (p.activo === false) {
            await supabase.auth.signOut();
            return { error: "Tu cuenta ha sido desactivada temporalmente. Contacta a coordinación académica." };
          }
          setUser(data.user);
          setProfile(p);
          setStoredAuth(data.user, p);
          return {};
        }

        return { error: "No se pudo obtener la sesión del usuario." };
      } catch (err) {
        return { error: (err as Error).message || "Error al conectar con el servidor de autenticación." };
      }
    }

    // Modo demostración en entorno local de desarrollo explícito (Vite DEV)
    if (import.meta.env.DEV) {
      const isEstudianteDemo =
        roleHint === "estudiante" ||
        raw.toLowerCase().includes("estudiante") ||
        raw.toLowerCase().includes("alumno");

      const isDocenteDemo =
        roleHint === "docente" ||
        raw.toLowerCase().includes("docente") ||
        raw.toLowerCase().includes("profesor");

      const fallbackRole: UserRole = isEstudianteDemo
        ? "estudiante"
        : isDocenteDemo
          ? "docente"
          : (roleHint ?? "admin");

      const fallbackName =
        fallbackRole === "estudiante"
          ? "Estudiante FUNASF (Demo)"
          : fallbackRole === "docente"
            ? "Docente FUNASF (Demo)"
            : "Administrador FUNASF (Demo)";

      const fallbackId =
        fallbackRole === "estudiante"
          ? "demo-estudiante-id"
          : fallbackRole === "docente"
            ? "demo-docente-id"
            : "admin-session-id";

      const fallbackUser = {
        id: fallbackId,
        email: emailToUse,
        app_metadata: {},
        user_metadata: { nombre_completo: fallbackName, rol: fallbackRole },
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;

      const fallbackProfile: UserProfile = {
        id: fallbackId,
        email: emailToUse,
        nombre_completo: fallbackName,
        rol: fallbackRole,
        avatar_url: null,
        usuario: (raw.includes("@") ? raw.split("@")[0] : raw) || null,
        activo: true,
      };

      setUser(fallbackUser);
      setProfile(fallbackProfile);
      setStoredAuth(fallbackUser, fallbackProfile);
      return {};
    }

    return {
      error:
        "El servicio de autenticación no está disponible en este momento. Por favor contacta al administrador.",
    };
  };

  const updateOwnAccount = async (params: {
    password?: string | undefined;
    telefono?: string | undefined;
    nombre_completo?: string | undefined;
  }): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !profile) {
      return { ok: false, error: "No hay sesión activa." };
    }

    if (params.password !== undefined && params.password.trim() !== "") {
      if (params.password.trim().length < 6) {
        return { ok: false, error: "La nueva contraseña debe tener al menos 6 caracteres." };
      }
      if (configured) {
        const { error: pwdErr } = await supabase.auth.updateUser({
          password: params.password.trim(),
        });
        if (pwdErr) {
          return { ok: false, error: pwdErr.message };
        }
      }
    }

    const dbUpdates: { telefono?: string | null; nombre_completo?: string } = {};
    if (params.telefono !== undefined) {
      dbUpdates.telefono = params.telefono.trim() || null;
    }
    if (params.nombre_completo !== undefined && params.nombre_completo.trim() !== "") {
      dbUpdates.nombre_completo = params.nombre_completo.trim();
    }

    if (Object.keys(dbUpdates).length > 0) {
      if (configured) {
        const { error: dbErr } = await supabase
          .from("perfiles")
          .update(dbUpdates)
          .eq("id", user.id);

        if (dbErr) {
          return { ok: false, error: dbErr.message };
        }
      }

      const nextProfile: UserProfile = {
        ...profile,
        ...(dbUpdates.telefono !== undefined ? { telefono: dbUpdates.telefono } : {}),
        ...(dbUpdates.nombre_completo !== undefined
          ? { nombre_completo: dbUpdates.nombre_completo }
          : {}),
      };
      setProfile(nextProfile);
      setStoredAuth(user, nextProfile);
    }

    return { ok: true };
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
        updateOwnAccount,
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
