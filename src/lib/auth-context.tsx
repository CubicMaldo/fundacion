import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type UserRole = "admin" | "editor";

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
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function isSupabaseConfigured(): boolean {
  try {
    const url =
      import.meta.env["VITE_SUPABASE_URL"] ||
      (typeof process !== "undefined" ? process.env?.["SUPABASE_URL"] : undefined);
    const key =
      import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      (typeof process !== "undefined" ? process.env?.["SUPABASE_PUBLISHABLE_KEY"] : undefined);
    return Boolean(url && key);
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
          // Si no existe perfil en la tabla pero está autenticado, asignamos editor o admin por defecto
          const fallbackProfile: UserProfile = {
            id: userId,
            email: userEmail,
            nombre_completo: userEmail.split("@")[0] ?? "Usuario",
            rol: "admin", // Primer usuario como admin
            avatar_url: null,
          };
          return fallbackProfile;
        }

        return {
          id: data.id,
          email: data.email,
          nombre_completo: data.nombre_completo,
          rol: (data.rol as UserRole) || "editor",
          avatar_url: data.avatar_url,
        };
      } catch {
        return {
          id: userId,
          email: userEmail,
          nombre_completo: userEmail.split("@")[0] ?? "Usuario",
          rol: "admin",
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
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!configured) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function initSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          setUser(session.user);
          const p = await fetchProfile(session.user.id, session.user.email ?? "");
          if (isMounted) setProfile(p);
        }
      } catch (err) {
        console.warn("[Auth] No se pudo inicializar sesión:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setUser(session.user);
        const p = await fetchProfile(session.user.id, session.user.email ?? "");
        if (isMounted) setProfile(p);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [configured, fetchProfile]);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!configured) {
      // Modo demostración local si aún no se configuraron claves
      const mockUser = {
        id: "demo-user-id",
        email,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      } as User;
      setUser(mockUser);
      setProfile({
        id: mockUser.id,
        email,
        nombre_completo: "Administrador FUNASF",
        rol: "admin",
        avatar_url: null,
      });
      return {};
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        const p = await fetchProfile(data.user.id, data.user.email ?? "");
        setProfile(p);
      }

      return {};
    } catch (err) {
      return { error: (err as Error).message || "Error al iniciar sesión" };
    }
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
  };

  const role = profile?.rol ?? null;
  const isAdmin = role === "admin";
  const isEditor = role === "editor" || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isEditor,
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
