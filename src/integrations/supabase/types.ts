export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      articulos: {
        Row: {
          autor_id: string | null
          autor_nombre: string
          categoria: string
          contenido: string
          created_at: string
          estado: Database["public"]["Enums"]["post_estado"]
          fecha_publicacion: string | null
          id: string
          imagen_portada: string | null
          resumen: string
          slug: string
          titulo: string
          updated_at: string
        }
        Insert: {
          autor_id?: string | null
          autor_nombre?: string
          categoria?: string
          contenido: string
          created_at?: string
          estado?: Database["public"]["Enums"]["post_estado"]
          fecha_publicacion?: string | null
          id?: string
          imagen_portada?: string | null
          resumen: string
          slug: string
          titulo: string
          updated_at?: string
        }
        Update: {
          autor_id?: string | null
          autor_nombre?: string
          categoria?: string
          contenido?: string
          created_at?: string
          estado?: Database["public"]["Enums"]["post_estado"]
          fecha_publicacion?: string | null
          id?: string
          imagen_portada?: string | null
          resumen?: string
          slug?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articulos_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracion: {
        Row: {
          clave: string
          updated_at: string
          updated_by: string | null
          valor: Json
        }
        Insert: {
          clave: string
          updated_at?: string
          updated_by?: string | null
          valor: Json
        }
        Update: {
          clave?: string
          updated_at?: string
          updated_by?: string | null
          valor?: Json
        }
        Relationships: [
          {
            foreignKeyName: "configuracion_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos: {
        Row: {
          activo: boolean
          aula: string | null
          codigo: string
          created_at: string
          docente_id: string | null
          horario_descripcion: string | null
          id: string
          nombre: string
          periodo: string
          programa_id: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          aula?: string | null
          codigo: string
          created_at?: string
          docente_id?: string | null
          horario_descripcion?: string | null
          id?: string
          nombre: string
          periodo?: string
          programa_id: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          aula?: string | null
          codigo?: string
          created_at?: string
          docente_id?: string | null
          horario_descripcion?: string | null
          id?: string
          nombre?: string
          periodo?: string
          programa_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cursos_docente_id_fkey"
            columns: ["docente_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cursos_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "programas"
            referencedColumns: ["id"]
          },
        ]
      }
      entregas_trabajos: {
        Row: {
          archivo_url: string
          created_at: string
          descripcion: string | null
          estado: string
          fecha_entrega: string
          id: string
          matricula_id: string
          nota: number | null
          retroalimentacion: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          archivo_url: string
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_entrega?: string
          id?: string
          matricula_id: string
          nota?: number | null
          retroalimentacion?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          archivo_url?: string
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_entrega?: string
          id?: string
          matricula_id?: string
          nota?: number | null
          retroalimentacion?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entregas_trabajos_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluaciones_notas: {
        Row: {
          created_at: string
          id: string
          matricula_id: string
          nota: number
          porcentaje: number
          retroalimentacion: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          matricula_id: string
          nota: number
          porcentaje: number
          retroalimentacion?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          matricula_id?: string
          nota?: number
          porcentaje?: number
          retroalimentacion?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluaciones_notas_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      galeria: {
        Row: {
          activo: boolean
          alt_text: string | null
          categoria: string
          created_at: string
          descripcion: string | null
          id: string
          imagen_url: string
          orden: number
          titulo: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          alt_text?: string | null
          categoria?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          imagen_url: string
          orden?: number
          titulo: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          alt_text?: string | null
          categoria?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          imagen_url?: string
          orden?: number
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      inscripciones: {
        Row: {
          ciudad: string
          correo: string
          created_at: string
          documento_numero: string
          documento_tipo: string
          estado: Database["public"]["Enums"]["inscripcion_estado"]
          id: string
          nombre_completo: string
          notas_internas: string | null
          programa_id: string | null
          programa_nombre: string
          telefono: string
          updated_at: string
        }
        Insert: {
          ciudad: string
          correo: string
          created_at?: string
          documento_numero: string
          documento_tipo?: string
          estado?: Database["public"]["Enums"]["inscripcion_estado"]
          id?: string
          nombre_completo: string
          notas_internas?: string | null
          programa_id?: string | null
          programa_nombre: string
          telefono: string
          updated_at?: string
        }
        Update: {
          ciudad?: string
          correo?: string
          created_at?: string
          documento_numero?: string
          documento_tipo?: string
          estado?: Database["public"]["Enums"]["inscripcion_estado"]
          id?: string
          nombre_completo?: string
          notas_internas?: string | null
          programa_id?: string | null
          programa_nombre?: string
          telefono?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inscripciones_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "programas"
            referencedColumns: ["id"]
          },
        ]
      }
      matriculas: {
        Row: {
          created_at: string
          curso_id: string
          estado: string
          estudiante_id: string
          fecha_matricula: string
          id: string
          nota_definitiva: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          curso_id: string
          estado?: string
          estudiante_id: string
          fecha_matricula?: string
          id?: string
          nota_definitiva?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          curso_id?: string
          estado?: string
          estudiante_id?: string
          fecha_matricula?: string
          id?: string
          nota_definitiva?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matriculas_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matriculas_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mensajes_contacto: {
        Row: {
          asunto: string
          correo: string
          created_at: string
          estado: Database["public"]["Enums"]["mensaje_estado"]
          id: string
          leido: boolean
          mensaje: string
          nombre: string
          telefono: string | null
        }
        Insert: {
          asunto: string
          correo: string
          created_at?: string
          estado?: Database["public"]["Enums"]["mensaje_estado"]
          id?: string
          leido?: boolean
          mensaje: string
          nombre: string
          telefono?: string | null
        }
        Update: {
          asunto?: string
          correo?: string
          created_at?: string
          estado?: Database["public"]["Enums"]["mensaje_estado"]
          id?: string
          leido?: boolean
          mensaje?: string
          nombre?: string
          telefono?: string | null
        }
        Relationships: []
      }
      observaciones_academicas: {
        Row: {
          creado_por: string | null
          created_at: string
          detalle: string
          id: string
          matricula_id: string
          tipo: string
          titulo: string
        }
        Insert: {
          creado_por?: string | null
          created_at?: string
          detalle: string
          id?: string
          matricula_id: string
          tipo?: string
          titulo: string
        }
        Update: {
          creado_por?: string | null
          created_at?: string
          detalle?: string
          id?: string
          matricula_id?: string
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "observaciones_academicas_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observaciones_academicas_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          nombre_completo: string | null
          rol: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          nombre_completo?: string | null
          rol?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          nombre_completo?: string | null
          rol?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      programas: {
        Row: {
          activo: boolean
          categoria: string
          categoria_id: string
          certificacion_nota: string | null
          created_at: string
          descripcion: string
          destacado: boolean
          duracion_estimada: string | null
          id: string
          modalidades: string[]
          nombre: string
          objetivo: string
          orden: number
          perfil_ocupacional: string[]
          requisitos: string[]
          slug: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          categoria: string
          categoria_id: string
          certificacion_nota?: string | null
          created_at?: string
          descripcion: string
          destacado?: boolean
          duracion_estimada?: string | null
          id?: string
          modalidades?: string[]
          nombre: string
          objetivo: string
          orden?: number
          perfil_ocupacional?: string[]
          requisitos?: string[]
          slug: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          categoria?: string
          categoria_id?: string
          certificacion_nota?: string | null
          created_at?: string
          descripcion?: string
          destacado?: boolean
          duracion_estimada?: string | null
          id?: string
          modalidades?: string[]
          nombre?: string
          objetivo?: string
          orden?: number
          perfil_ocupacional?: string[]
          requisitos?: string[]
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_editor_or_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "docente" | "estudiante"
      inscripcion_estado:
        | "nuevo"
        | "contactado"
        | "en_revision"
        | "admitido"
        | "descartado"
      mensaje_estado: "nuevo" | "respondido" | "archivado"
      post_estado: "borrador" | "publicado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "docente", "estudiante"],
      inscripcion_estado: [
        "nuevo",
        "contactado",
        "en_revision",
        "admitido",
        "descartado",
      ],
      mensaje_estado: ["nuevo", "respondido", "archivado"],
      post_estado: ["borrador", "publicado"],
    },
  },
} as const
