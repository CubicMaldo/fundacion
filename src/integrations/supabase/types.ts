export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      perfiles: {
        Row: {
          id: string;
          email: string;
          nombre_completo: string | null;
          rol: "admin" | "editor";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nombre_completo?: string | null;
          rol?: "admin" | "editor";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nombre_completo?: string | null;
          rol?: "admin" | "editor";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      programas: {
        Row: {
          id: string;
          slug: string;
          nombre: string;
          categoria_id: string;
          categoria: string;
          descripcion: string;
          objetivo: string;
          modalidades: string[];
          perfil_ocupacional: string[];
          requisitos: string[];
          certificacion_nota: string | null;
          duracion_estimada: string | null;
          orden: number;
          activo: boolean;
          destacado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          nombre: string;
          categoria_id: string;
          categoria: string;
          descripcion: string;
          objetivo: string;
          modalidades?: string[];
          perfil_ocupacional?: string[];
          requisitos?: string[];
          certificacion_nota?: string | null;
          duracion_estimada?: string | null;
          orden?: number;
          activo?: boolean;
          destacado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          nombre?: string;
          categoria_id?: string;
          categoria?: string;
          descripcion?: string;
          objetivo?: string;
          modalidades?: string[];
          perfil_ocupacional?: string[];
          requisitos?: string[];
          certificacion_nota?: string | null;
          duracion_estimada?: string | null;
          orden?: number;
          activo?: boolean;
          destacado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      articulos: {
        Row: {
          id: string;
          slug: string;
          titulo: string;
          resumen: string;
          contenido: string;
          autor_id: string | null;
          autor_nombre: string;
          categoria: string;
          imagen_portada: string | null;
          estado: "borrador" | "publicado";
          fecha_publicacion: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          titulo: string;
          resumen: string;
          contenido: string;
          autor_id?: string | null;
          autor_nombre?: string;
          categoria?: string;
          imagen_portada?: string | null;
          estado?: "borrador" | "publicado";
          fecha_publicacion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          titulo?: string;
          resumen?: string;
          contenido?: string;
          autor_id?: string | null;
          autor_nombre?: string;
          categoria?: string;
          imagen_portada?: string | null;
          estado?: "borrador" | "publicado";
          fecha_publicacion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      galeria: {
        Row: {
          id: string;
          titulo: string;
          descripcion: string | null;
          categoria: string;
          imagen_url: string;
          alt_text: string | null;
          orden: number;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          descripcion?: string | null;
          categoria?: string;
          imagen_url: string;
          alt_text?: string | null;
          orden?: number;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          descripcion?: string | null;
          categoria?: string;
          imagen_url?: string;
          alt_text?: string | null;
          orden?: number;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      inscripciones: {
        Row: {
          id: string;
          nombre_completo: string;
          documento_tipo: string;
          documento_numero: string;
          telefono: string;
          correo: string;
          ciudad: string;
          programa_id: string | null;
          programa_nombre: string;
          estado: "nuevo" | "contactado" | "en_revision" | "admitido" | "descartado";
          notas_internas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre_completo: string;
          documento_tipo?: string;
          documento_numero: string;
          telefono: string;
          correo: string;
          ciudad: string;
          programa_id?: string | null;
          programa_nombre: string;
          estado?: "nuevo" | "contactado" | "en_revision" | "admitido" | "descartado";
          notas_internas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre_completo?: string;
          documento_tipo?: string;
          documento_numero?: string;
          telefono?: string;
          correo?: string;
          ciudad?: string;
          programa_id?: string | null;
          programa_nombre?: string;
          estado?: "nuevo" | "contactado" | "en_revision" | "admitido" | "descartado";
          notas_internas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      mensajes_contacto: {
        Row: {
          id: string;
          nombre: string;
          correo: string;
          telefono: string | null;
          asunto: string;
          mensaje: string;
          leido: boolean;
          estado: "nuevo" | "respondido" | "archivado";
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          correo: string;
          telefono?: string | null;
          asunto: string;
          mensaje: string;
          leido?: boolean;
          estado?: "nuevo" | "respondido" | "archivado";
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          correo?: string;
          telefono?: string | null;
          asunto?: string;
          mensaje?: string;
          leido?: boolean;
          estado?: "nuevo" | "respondido" | "archivado";
          created_at?: string;
        };
        Relationships: [];
      };
      configuracion: {
        Row: {
          clave: string;
          valor: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          clave: string;
          valor: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          clave?: string;
          valor?: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_editor_or_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "editor";
      post_estado: "borrador" | "publicado";
      inscripcion_estado: "nuevo" | "contactado" | "en_revision" | "admitido" | "descartado";
      mensaje_estado: "nuevo" | "respondido" | "archivado";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
      post_estado: ["borrador", "publicado"],
      inscripcion_estado: ["nuevo", "contactado", "en_revision", "admitido", "descartado"],
      mensaje_estado: ["nuevo", "respondido", "archivado"],
    },
  },
} as const;
