import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

const ERROR_SISTEMA_NO_DISPONIBLE =
  "El sistema académico no se encuentra disponible temporalmente. Por favor intenta más tarde o comunícate con la coordinación académica.";

// ============================================================================
// TIPOS DEL DOMINIO ACADÉMICO
// ============================================================================

export interface Curso {
  id: string;
  programaId: string;
  programaNombre?: string;
  docenteId?: string | null;
  docenteNombre?: string | null;
  nombre: string;
  codigo: string;
  periodo: string;
  horarioDescripcion?: string | null;
  aula?: string | null;
  activo: boolean;
}

export interface EvaluacionNota {
  id: string;
  matriculaId: string;
  titulo: string;
  porcentaje: number;
  nota: number;
  retroalimentacion?: string | null;
  createdAt: string;
}

export interface EntregaTrabajo {
  id: string;
  matriculaId: string;
  titulo: string;
  descripcion?: string | null;
  archivoUrl: string;
  estado: "entregado" | "revisado" | "calificado";
  nota?: number | null;
  retroalimentacion?: string | null;
  fechaEntrega: string;
}

export interface ObservacionAcademica {
  id: string;
  matriculaId: string;
  tipo: "felicitacion" | "alerta_academica" | "asistencia" | "seguimiento";
  titulo: string;
  detalle: string;
  creadoPorNombre?: string | null;
  createdAt: string;
}

export interface MatriculaEstudiante {
  id: string;
  estudianteId: string;
  cursoId: string;
  curso: Curso;
  estado: "cursando" | "aprobado" | "reprobado" | "retirado";
  notaDefinitiva?: number | null;
  fechaMatricula: string;
  notas: EvaluacionNota[];
  entregas: EntregaTrabajo[];
  observaciones: ObservacionAcademica[];
}

export interface EstudianteMatriculado {
  matriculaId: string;
  estudianteId: string;
  nombreCompleto: string;
  email: string;
  estado: "cursando" | "aprobado" | "reprobado" | "retirado";
  notaDefinitiva?: number | null;
  notas: EvaluacionNota[];
  observaciones: ObservacionAcademica[];
}

// Datos de demostración cuando se prueba localmente sin conexión a Supabase
const DEMO_MATRICULAS: MatriculaEstudiante[] = [
  {
    id: "mat-demo-1",
    estudianteId: "demo-estudiante-id",
    cursoId: "curso-demo-1",
    curso: {
      id: "curso-demo-1",
      programaId: "prog-enfermeria",
      programaNombre: "Auxiliar en Enfermería",
      nombre: "Morfofisiología y Primeros Auxilios",
      codigo: "ENF-101",
      periodo: "2026-1",
      horarioDescripcion: "Sábados 8:00 AM - 1:00 PM",
      aula: "Sede Cali - Aula 204",
      activo: true,
    },
    estado: "cursando",
    notaDefinitiva: 4.2,
    fechaMatricula: "2026-02-15",
    notas: [
      {
        id: "nota-1",
        matriculaId: "mat-demo-1",
        titulo: "Taller de Signos Vitales y Triaje",
        porcentaje: 25,
        nota: 4.5,
        retroalimentacion: "Excelente destreza en la toma de signos.",
        createdAt: "2026-03-01",
      },
      {
        id: "nota-2",
        matriculaId: "mat-demo-1",
        titulo: "Primer Parcial Teórico",
        porcentaje: 35,
        nota: 4.0,
        retroalimentacion: "Buen dominio de conceptos anatómicos.",
        createdAt: "2026-03-20",
      },
    ],
    entregas: [
      {
        id: "ent-1",
        matriculaId: "mat-demo-1",
        titulo: "Protocolo de Bioseguridad y RCP",
        archivoUrl: "#",
        estado: "calificado",
        nota: 4.5,
        retroalimentacion: "Cumple con las guías internacionales vigentes.",
        fechaEntrega: "2026-03-15",
      },
    ],
    observaciones: [
      {
        id: "obs-1",
        matriculaId: "mat-demo-1",
        tipo: "felicitacion",
        titulo: "Participación destacada en simulación",
        detalle: "Demostró liderazgo y empatía en la práctica clínica de urgencias.",
        createdAt: "2026-03-18",
      },
    ],
  },
];

// ============================================================================
// FUNCIONES PARA EL ESTUDIANTE
// ============================================================================

/**
 * Consulta todas las asignaturas matriculadas por el estudiante autenticado,
 * junto con sus calificaciones parciales, entregas y observaciones.
 */
export async function getMisMatriculasYNotas(
  estudianteId: string,
): Promise<{ ok: boolean; data?: MatriculaEstudiante[]; error?: string }> {
  if (estudianteId === "demo-estudiante-id" && !isSupabaseConfigured()) {
    return { ok: true, data: DEMO_MATRICULAS };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: ERROR_SISTEMA_NO_DISPONIBLE };
  }

  try {
    // 1. Consultar matrículas del estudiante con información del curso
    const { data: matriculasData, error: matriculasErr } = await supabase
      .from("matriculas" as any)
      .select(
        `
        id,
        estudiante_id,
        curso_id,
        estado,
        nota_definitiva,
        fecha_matricula,
        cursos (
          id,
          programa_id,
          docente_id,
          nombre,
          codigo,
          periodo,
          horario_descripcion,
          aula,
          activo,
          programas ( nombre )
        )
      `,
      )
      .eq("estudiante_id", estudianteId);

    if (matriculasErr) {
      console.error("[Académico] Error consultando matrículas:", matriculasErr);
      return { ok: false, error: ERROR_SISTEMA_NO_DISPONIBLE };
    }

    if (!matriculasData || matriculasData.length === 0) {
      return { ok: true, data: [] };
    }

    const matriculaIds = matriculasData.map((m: any) => m.id);

    // 2. Consultar notas, entregas y observaciones asociadas
    const [notasRes, entregasRes, obsRes] = await Promise.all([
      supabase
        .from("evaluaciones_notas" as any)
        .select("*")
        .in("matricula_id", matriculaIds)
        .order("created_at", { ascending: true }),
      supabase
        .from("entregas_trabajos" as any)
        .select("*")
        .in("matricula_id", matriculaIds)
        .order("fecha_entrega", { ascending: false }),
      supabase
        .from("observaciones_academicas" as any)
        .select("*")
        .in("matricula_id", matriculaIds)
        .order("created_at", { ascending: false }),
    ]);

    const todasLasNotas = (notasRes.data || []) as any[];
    const todasLasEntregas = (entregasRes.data || []) as any[];
    const todasLasObservaciones = (obsRes.data || []) as any[];

    // 3. Ensamblar modelo completo
    const resultado: MatriculaEstudiante[] = matriculasData.map((m: any) => {
      const c = m.cursos || {};
      const cursoObj: Curso = {
        id: c.id || m.curso_id,
        programaId: c.programa_id,
        programaNombre: c.programas?.nombre || "Programa Técnico FUNASF",
        docenteId: c.docente_id,
        nombre: c.nombre || "Módulo Académico",
        codigo: c.codigo || "MOD-00",
        periodo: c.periodo || "2026-1",
        horarioDescripcion: c.horario_descripcion,
        aula: c.aula,
        activo: c.activo ?? true,
      };

      const notas = todasLasNotas
        .filter((n) => n.matricula_id === m.id)
        .map((n) => ({
          id: n.id,
          matriculaId: n.matricula_id,
          titulo: n.titulo,
          porcentaje: n.porcentaje,
          nota: Number(n.nota),
          retroalimentacion: n.retroalimentacion,
          createdAt: n.created_at,
        }));

      const entregas = todasLasEntregas
        .filter((e) => e.matricula_id === m.id)
        .map((e) => ({
          id: e.id,
          matriculaId: e.matricula_id,
          titulo: e.titulo,
          descripcion: e.descripcion,
          archivoUrl: e.archivo_url,
          estado: e.estado,
          nota: e.nota != null ? Number(e.nota) : null,
          retroalimentacion: e.retroalimentacion,
          fechaEntrega: e.fecha_entrega,
        }));

      const observaciones = todasLasObservaciones
        .filter((o) => o.matricula_id === m.id)
        .map((o) => ({
          id: o.id,
          matriculaId: o.matricula_id,
          tipo: o.tipo,
          titulo: o.titulo,
          detalle: o.detalle,
          createdAt: o.created_at,
        }));

      return {
        id: m.id,
        estudianteId: m.estudiante_id,
        cursoId: m.curso_id,
        curso: cursoObj,
        estado: m.estado,
        notaDefinitiva: m.nota_definitiva != null ? Number(m.nota_definitiva) : null,
        fechaMatricula: m.fecha_matricula,
        notas,
        entregas,
        observaciones,
      };
    });

    return { ok: true, data: resultado };
  } catch (err) {
    console.error("[Académico] Excepción consultando información académica:", err);
    return { ok: false, error: ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

/**
 * Permite al estudiante subir un archivo de evidencia o trabajo práctico.
 */
export async function subirEntregaTrabajo(params: {
  matriculaId: string;
  titulo: string;
  descripcion?: string | undefined;
  archivo: File;
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: ERROR_SISTEMA_NO_DISPONIBLE };
  }

  try {
    const fileExt = params.archivo.name.split(".").pop() || "pdf";
    const cleanName = params.archivo.name
      .substring(0, params.archivo.name.lastIndexOf("."))
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 30);
    const filePath = `${params.matriculaId}/${cleanName}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("evidencias-academicas")
      .upload(filePath, params.archivo, { upsert: false });

    if (uploadError) {
      console.error("[Académico] Error subiendo evidencia:", uploadError);
      return { ok: false, error: "No se pudo subir el archivo de la evidencia." };
    }

    const { data: publicUrlData } = supabase.storage
      .from("evidencias-academicas")
      .getPublicUrl(filePath);

    const archivoUrl = publicUrlData?.publicUrl || filePath;

    const { error: insertError } = await supabase.from("entregas_trabajos" as any).insert({
      matricula_id: params.matriculaId,
      titulo: params.titulo,
      descripcion: params.descripcion || null,
      archivo_url: archivoUrl,
      estado: "entregado",
    });

    if (insertError) {
      return { ok: false, error: insertError.message };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

// ============================================================================
// FUNCIONES PARA EL DOCENTE
// ============================================================================

/**
 * Consulta los cursos asignados al docente autenticado.
 */
export async function getCursosDocente(
  docenteId: string,
): Promise<{ ok: boolean; data?: Curso[]; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: ERROR_SISTEMA_NO_DISPONIBLE };
  }

  try {
    const { data, error } = await supabase
      .from("cursos" as any)
      .select("*, programas(nombre)")
      .eq("docente_id", docenteId)
      .eq("activo", true)
      .order("nombre", { ascending: true });

    if (error) {
      return { ok: false, error: error.message };
    }

    const cursos: Curso[] = (data || []).map((c: any) => ({
      id: c.id,
      programaId: c.programa_id,
      programaNombre: c.programas?.nombre || "Programa Técnico",
      docenteId: c.docente_id,
      nombre: c.nombre,
      codigo: c.codigo,
      periodo: c.periodo,
      horarioDescripcion: c.horario_descripcion,
      aula: c.aula,
      activo: c.activo,
    }));

    return { ok: true, data: cursos };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

/**
 * Registra una calificación parcial para un estudiante en una matrícula.
 */
export async function registrarNotaEvaluacion(params: {
  matriculaId: string;
  titulo: string;
  porcentaje: number;
  nota: number;
  retroalimentacion?: string | undefined;
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: ERROR_SISTEMA_NO_DISPONIBLE };
  }

  try {
    const { error } = await supabase.from("evaluaciones_notas" as any).insert({
      matricula_id: params.matriculaId,
      titulo: params.titulo,
      porcentaje: params.porcentaje,
      nota: params.nota,
      retroalimentacion: params.retroalimentacion || null,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}
