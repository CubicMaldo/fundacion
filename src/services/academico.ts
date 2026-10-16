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
  notaMinimaAprobacion: number;
  descripcion?: string | null;
}

export interface ComponenteEvaluacion {
  id: string;
  cursoId: string;
  nombre: string;
  descripcion?: string | null;
  porcentaje: number;
  orden: number;
}

export interface Calificacion {
  id: string;
  componenteId: string;
  matriculaId: string;
  nota: number;
  retroalimentacion?: string | null;
  updatedAt?: string;
}

export interface NotaDesglosada {
  componenteId: string;
  nombre: string;
  porcentaje: number;
  nota: number | null;
  retroalimentacion?: string | null;
  aportePonderado: number; // (nota * porcentaje) / 100
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
  malla: ComponenteEvaluacion[];
  calificaciones: Calificacion[];
  desglose: NotaDesglosada[];
  entregas: EntregaTrabajo[];
  observaciones: ObservacionAcademica[];
}

export interface EstudianteMatriculado {
  matriculaId: string;
  estudianteId: string;
  nombreCompleto: string;
  email: string;
  documento?: string | null;
  telefono?: string | null;
  estado: "cursando" | "aprobado" | "reprobado" | "retirado";
  notaDefinitiva?: number | null;
  calificaciones: Record<string, Calificacion>; // componenteId -> Calificacion
  observaciones: ObservacionAcademica[];
  entregas: EntregaTrabajo[];
}

export interface CursoDetalleDocente {
  curso: Curso;
  componentes: ComponenteEvaluacion[];
  sumaPorcentajes: number;
  estudiantes: EstudianteMatriculado[];
}

// ============================================================================
// FUNCIONES PURAS DE CÁLCULO Y VALIDACIÓN
// ============================================================================

export function validarRangoNota(nota: number): boolean {
  return typeof nota === "number" && !isNaN(nota) && nota >= 0 && nota <= 5.0;
}

export function validarMallaPorcentajes(componentes: Array<{ porcentaje: number }>): {
  suma: number;
  esValida: boolean;
  falta: number;
} {
  const suma = Number(
    componentes.reduce((acc, c) => acc + (Number(c.porcentaje) || 0), 0).toFixed(2),
  );
  return {
    suma,
    esValida: Math.abs(suma - 100) < 0.001,
    falta: Number((100 - suma).toFixed(2)),
  };
}

export function calcularNotaDefinitiva(
  componentes: ComponenteEvaluacion[],
  calificaciones: Record<string, number | { nota: number } | null | undefined>,
): {
  definitiva: number;
  porcentajeEvaluado: number;
  esCompleto: boolean;
} {
  let acumulado = 0;
  let porcentajeEvaluado = 0;

  for (const comp of componentes) {
    const raw = calificaciones[comp.id];
    const nota =
      typeof raw === "object" && raw !== null
        ? raw.nota
        : typeof raw === "number"
          ? raw
          : null;

    if (nota !== null && !isNaN(nota) && validarRangoNota(nota)) {
      acumulado += (nota * comp.porcentaje) / 100;
      porcentajeEvaluado += comp.porcentaje;
    }
  }

  const definitiva = Number(acumulado.toFixed(2));
  return {
    definitiva,
    porcentajeEvaluado: Number(porcentajeEvaluado.toFixed(2)),
    esCompleto: Math.abs(porcentajeEvaluado - 100) < 0.001,
  };
}

// ============================================================================
// DATOS DEMO (para desarrollo offline o vista previa)
// ============================================================================

const DEMO_MALLA: ComponenteEvaluacion[] = [
  { id: "comp-1", cursoId: "curso-demo-1", nombre: "Primer Parcial Teórico", porcentaje: 30, orden: 1 },
  { id: "comp-2", cursoId: "curso-demo-1", nombre: "Talleres y Guías de Laboratorio", porcentaje: 30, orden: 2 },
  { id: "comp-3", cursoId: "curso-demo-1", nombre: "Evaluación Práctica Final", porcentaje: 40, orden: 3 },
];

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
      notaMinimaAprobacion: 3.0,
      descripcion: "Fundamentos morfológicos, sistemas corporales y respuesta a emergencias.",
    },
    estado: "cursando",
    notaDefinitiva: 4.15,
    fechaMatricula: "2026-02-15",
    malla: DEMO_MALLA,
    calificaciones: [
      { id: "cal-1", componenteId: "comp-1", matriculaId: "mat-demo-1", nota: 4.5, retroalimentacion: "Excelente dominio." },
      { id: "cal-2", componenteId: "comp-2", matriculaId: "mat-demo-1", nota: 4.0, retroalimentacion: "Muy buenas evidencias." },
      { id: "cal-3", componenteId: "comp-3", matriculaId: "mat-demo-1", nota: 4.0, retroalimentacion: "Buena técnica." },
    ],
    desglose: [
      { componenteId: "comp-1", nombre: "Primer Parcial Teórico", porcentaje: 30, nota: 4.5, aportePonderado: 1.35, retroalimentacion: "Excelente dominio." },
      { componenteId: "comp-2", nombre: "Talleres y Guías de Laboratorio", porcentaje: 30, nota: 4.0, aportePonderado: 1.2, retroalimentacion: "Muy buenas evidencias." },
      { componenteId: "comp-3", nombre: "Evaluación Práctica Final", porcentaje: 40, nota: 4.0, aportePonderado: 1.6, retroalimentacion: "Buena técnica." },
    ],
    entregas: [
      {
        id: "ent-1",
        matriculaId: "mat-demo-1",
        titulo: "Protocolo de Bioseguridad y RCP",
        archivoUrl: "#",
        estado: "calificado",
        nota: 4.5,
        retroalimentacion: "Cumple con las guías vigentes.",
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
    const { data: matriculasData, error: matriculasErr } = await supabase
      .from("matriculas")
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
          nota_minima_aprobacion,
          descripcion,
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
    const cursoIds = Array.from(new Set(matriculasData.map((m: any) => m.curso_id)));

    // Consultar componentes_evaluacion de esos cursos, calificaciones, entregas y observaciones
    const [componentesRes, calificacionesRes, entregasRes, obsRes] = await Promise.all([
      supabase
        .from("componentes_evaluacion")
        .select("*")
        .in("curso_id", cursoIds)
        .order("orden", { ascending: true }),
      supabase
        .from("calificaciones")
        .select("*")
        .in("matricula_id", matriculaIds),
      supabase
        .from("entregas_trabajos")
        .select("*")
        .in("matricula_id", matriculaIds)
        .order("fecha_entrega", { ascending: false }),
      supabase
        .from("observaciones_academicas")
        .select("*")
        .in("matricula_id", matriculaIds)
        .order("created_at", { ascending: false }),
    ]);

    const componentes = (componentesRes.data || []) as any[];
    const calificaciones = (calificacionesRes.data || []) as any[];
    const entregas = (entregasRes.data || []) as any[];
    const observaciones = (obsRes.data || []) as any[];

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
        notaMinimaAprobacion: Number(c.nota_minima_aprobacion ?? 3.0),
        descripcion: c.descripcion,
      };

      const cursoMalla: ComponenteEvaluacion[] = componentes
        .filter((comp) => comp.curso_id === cursoObj.id)
        .map((comp) => ({
          id: comp.id,
          cursoId: comp.curso_id,
          nombre: comp.nombre,
          descripcion: comp.descripcion,
          porcentaje: Number(comp.porcentaje),
          orden: comp.orden,
        }));

      const misCalificaciones: Calificacion[] = calificaciones
        .filter((cal) => cal.matricula_id === m.id)
        .map((cal) => ({
          id: cal.id,
          componenteId: cal.componente_id,
          matriculaId: cal.matricula_id,
          nota: Number(cal.nota),
          retroalimentacion: cal.retroalimentacion,
          updatedAt: cal.updated_at,
        }));

      const desglose: NotaDesglosada[] = cursoMalla.map((comp) => {
        const cal = misCalificaciones.find((cl) => cl.componenteId === comp.id);
        const nota = cal ? cal.nota : null;
        const aportePonderado = nota !== null ? Number(((nota * comp.porcentaje) / 100).toFixed(2)) : 0;
        return {
          componenteId: comp.id,
          nombre: comp.nombre,
          porcentaje: comp.porcentaje,
          nota,
          retroalimentacion: cal?.retroalimentacion ?? null,
          aportePonderado,
        };
      });

      const misEntregas: EntregaTrabajo[] = entregas
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

      const misObs: ObservacionAcademica[] = observaciones
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
        malla: cursoMalla,
        calificaciones: misCalificaciones,
        desglose,
        entregas: misEntregas,
        observaciones: misObs,
      };
    });

    return { ok: true, data: resultado };
  } catch (err) {
    console.error("[Académico] Excepción consultando información académica:", err);
    return { ok: false, error: ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

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
    const MAX_SIZE_BYTES = 15 * 1024 * 1024;
    if (params.archivo.size > MAX_SIZE_BYTES) {
      return { ok: false, error: "El archivo excede el tamaño máximo permitido de 15 MB." };
    }

    const rawExt = params.archivo.name.split(".").pop() || "pdf";
    const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 5) || "pdf";
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

    const { error: insertError } = await supabase.from("entregas_trabajos").insert({
      matricula_id: params.matriculaId,
      titulo: params.titulo.trim(),
      descripcion: params.descripcion?.trim() || null,
      archivo_url: filePath,
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

/**
 * Obtiene una URL firmada (Signed URL) temporal de 1 hora para visualizar
 * o descargar de forma segura un archivo del bucket privado 'evidencias-academicas'.
 */
export async function obtenerUrlDescargaEvidencia(archivoUrlOrPath: string): Promise<string> {
  if (!isSupabaseConfigured() || !archivoUrlOrPath) {
    return archivoUrlOrPath || "#";
  }

  try {
    if (archivoUrlOrPath.startsWith("blob:") || archivoUrlOrPath.startsWith("data:")) {
      return archivoUrlOrPath;
    }

    let cleanPath = archivoUrlOrPath;
    if (archivoUrlOrPath.includes("evidencias-academicas/")) {
      const parts = archivoUrlOrPath.split("evidencias-academicas/");
      const lastPart = parts[parts.length - 1] ?? "";
      cleanPath = lastPart.split("?")[0] ?? "";
    } else if (archivoUrlOrPath.startsWith("http://") || archivoUrlOrPath.startsWith("https://")) {
      // Si ya es una URL externa
      return archivoUrlOrPath;
    }

    cleanPath = cleanPath.replace(/^\/+/, "");

    const { data, error } = await supabase.storage
      .from("evidencias-academicas")
      .createSignedUrl(cleanPath, 3600);

    if (error || !data?.signedUrl) {
      console.warn("[Académico] No se pudo generar signedUrl:", error?.message);
      return archivoUrlOrPath;
    }

    return data.signedUrl;
  } catch (err) {
    console.error("[Académico] Excepción obteniendo URL firmada:", err);
    return archivoUrlOrPath;
  }
}

// ============================================================================
// FUNCIONES PARA EL DOCENTE
// ============================================================================

export async function getCursosDocente(
  docenteId: string,
): Promise<{ ok: boolean; data?: Curso[]; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: true,
      data: [
        {
          id: "curso-demo-1",
          programaId: "prog-enfermeria",
          programaNombre: "Auxiliar en Enfermería",
          docenteId,
          nombre: "Morfofisiología y Primeros Auxilios",
          codigo: "ENF-101",
          periodo: "2026-1",
          horarioDescripcion: "Sábados 8:00 AM - 1:00 PM",
          aula: "Sede Cali - Aula 204",
          activo: true,
          notaMinimaAprobacion: 3.0,
          descripcion: "Fundamentos morfológicos, sistemas corporales y respuesta a emergencias.",
        },
      ],
    };
  }

  try {
    const { data, error } = await supabase
      .from("cursos")
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
      notaMinimaAprobacion: Number(c.nota_minima_aprobacion ?? 3.0),
      descripcion: c.descripcion,
    }));

    return { ok: true, data: cursos };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

export async function getCursoDetalleDocente(
  cursoId: string,
): Promise<{ ok: boolean; data?: CursoDetalleDocente; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: true,
      data: {
        curso: DEMO_MATRICULAS[0]!.curso,
        componentes: DEMO_MALLA,
        sumaPorcentajes: 100,
        estudiantes: [
          {
            matriculaId: "mat-demo-1",
            estudianteId: "demo-estudiante-id",
            nombreCompleto: "Camila Rodríguez Torres",
            email: "camila.rodriguez@ejemplo.edu.co",
            documento: "1005847291",
            telefono: "3154829102",
            estado: "cursando",
            notaDefinitiva: 4.15,
            calificaciones: {
              "comp-1": { id: "cal-1", componenteId: "comp-1", matriculaId: "mat-demo-1", nota: 4.5, retroalimentacion: "Excelente dominio." },
              "comp-2": { id: "cal-2", componenteId: "comp-2", matriculaId: "mat-demo-1", nota: 4.0, retroalimentacion: "Muy buenas evidencias." },
              "comp-3": { id: "cal-3", componenteId: "comp-3", matriculaId: "mat-demo-1", nota: 4.0, retroalimentacion: "Buena técnica." },
            },
            observaciones: DEMO_MATRICULAS[0]!.observaciones,
            entregas: DEMO_MATRICULAS[0]!.entregas,
          },
        ],
      },
    };
  }

  try {
    // 1. Obtener curso
    const { data: cursoData, error: cursoErr } = await supabase
      .from("cursos")
      .select("*, programas(nombre)")
      .eq("id", cursoId)
      .maybeSingle();

    if (cursoErr || !cursoData) {
      return { ok: false, error: cursoErr?.message || "Curso no encontrado." };
    }

    const curso: Curso = {
      id: cursoData.id,
      programaId: cursoData.programa_id,
      programaNombre: (cursoData as any).programas?.nombre || "Programa Técnico",
      docenteId: cursoData.docente_id,
      nombre: cursoData.nombre,
      codigo: cursoData.codigo,
      periodo: cursoData.periodo,
      horarioDescripcion: cursoData.horario_descripcion,
      aula: cursoData.aula,
      activo: cursoData.activo,
      notaMinimaAprobacion: Number(cursoData.nota_minima_aprobacion ?? 3.0),
      descripcion: cursoData.descripcion,
    };

    // 2. Componentes de evaluación (malla)
    const { data: compData, error: compErr } = await supabase
      .from("componentes_evaluacion")
      .select("*")
      .eq("curso_id", cursoId)
      .order("orden", { ascending: true });

    if (compErr) {
      return { ok: false, error: compErr.message };
    }

    const componentes: ComponenteEvaluacion[] = (compData || []).map((c: any) => ({
      id: c.id,
      cursoId: c.curso_id,
      nombre: c.nombre,
      descripcion: c.descripcion,
      porcentaje: Number(c.porcentaje),
      orden: c.orden,
    }));

    const sumaPorcentajes = componentes.reduce((acc, c) => acc + c.porcentaje, 0);

    // 3. Estudiantes matriculados
    const { data: matData, error: matErr } = await supabase
      .from("matriculas")
      .select(
        `
        id,
        estudiante_id,
        estado,
        nota_definitiva,
        fecha_matricula,
        perfiles:estudiante_id (
          id,
          nombre_completo,
          email,
          documento,
          telefono
        )
      `,
      )
      .eq("curso_id", cursoId)
      .order("created_at", { ascending: true });

    if (matErr) {
      return { ok: false, error: matErr.message };
    }

    const matriculaIds = (matData || []).map((m: any) => m.id);

    // 4. Calificaciones, entregas y observaciones de estos estudiantes
    let todasCal: any[] = [];
    let todasObs: any[] = [];
    let todasEntregas: any[] = [];

    if (matriculaIds.length > 0) {
      const [calRes, obsRes, entRes] = await Promise.all([
        supabase.from("calificaciones").select("*").in("matricula_id", matriculaIds),
        supabase.from("observaciones_academicas").select("*").in("matricula_id", matriculaIds).order("created_at", { ascending: false }),
        supabase.from("entregas_trabajos").select("*").in("matricula_id", matriculaIds).order("fecha_entrega", { ascending: false }),
      ]);
      todasCal = calRes.data || [];
      todasObs = obsRes.data || [];
      todasEntregas = entRes.data || [];
    }

    const estudiantes: EstudianteMatriculado[] = (matData || []).map((m: any) => {
      const perf = m.perfiles || {};
      const calMap: Record<string, Calificacion> = {};
      todasCal
        .filter((c) => c.matricula_id === m.id)
        .forEach((c) => {
          calMap[c.componente_id] = {
            id: c.id,
            componenteId: c.componente_id,
            matriculaId: c.matricula_id,
            nota: Number(c.nota),
            retroalimentacion: c.retroalimentacion,
            updatedAt: c.updated_at,
          };
        });

      return {
        matriculaId: m.id,
        estudianteId: m.estudiante_id,
        nombreCompleto: perf.nombre_completo || "Estudiante",
        email: perf.email || "",
        documento: perf.documento,
        telefono: perf.telefono,
        estado: m.estado,
        notaDefinitiva: m.nota_definitiva != null ? Number(m.nota_definitiva) : null,
        calificaciones: calMap,
        observaciones: todasObs.filter((o) => o.matricula_id === m.id).map((o) => ({
          id: o.id,
          matriculaId: o.matricula_id,
          tipo: o.tipo,
          titulo: o.titulo,
          detalle: o.detalle,
          createdAt: o.created_at,
        })),
        entregas: todasEntregas.filter((e) => e.matricula_id === m.id).map((e) => ({
          id: e.id,
          matriculaId: e.matricula_id,
          titulo: e.titulo,
          descripcion: e.descripcion,
          archivoUrl: e.archivo_url,
          estado: e.estado,
          nota: e.nota != null ? Number(e.nota) : null,
          retroalimentacion: e.retroalimentacion,
          fechaEntrega: e.fecha_entrega,
        })),
      };
    });

    return {
      ok: true,
      data: {
        curso,
        componentes,
        sumaPorcentajes,
        estudiantes,
      },
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

// ---------------- Malla de Evaluación (Docente) ----------------

export async function crearComponenteEvaluacion(params: {
  cursoId: string;
  nombre: string;
  porcentaje: number;
  descripcion?: string | undefined;
  orden?: number | undefined;
}): Promise<{ ok: boolean; data?: ComponenteEvaluacion; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: true, data: { id: `comp-${Date.now()}`, cursoId: params.cursoId, nombre: params.nombre, porcentaje: params.porcentaje, orden: params.orden ?? 1 } };
  }

  try {
    const { data, error } = await supabase
      .from("componentes_evaluacion")
      .insert({
        curso_id: params.cursoId,
        nombre: params.nombre.trim(),
        porcentaje: params.porcentaje,
        descripcion: params.descripcion?.trim() || null,
        orden: params.orden ?? 0,
      })
      .select()
      .single();

    if (error) return { ok: false, error: error.message };
    return {
      ok: true,
      data: {
        id: data.id,
        cursoId: data.curso_id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        porcentaje: Number(data.porcentaje),
        orden: data.orden,
      },
    };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

export async function actualizarComponenteEvaluacion(params: {
  id: string;
  nombre?: string;
  porcentaje?: number;
  descripcion?: string | null;
  orden?: number;
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const updateObj: any = {};
    if (params.nombre !== undefined) updateObj.nombre = params.nombre.trim();
    if (params.porcentaje !== undefined) updateObj.porcentaje = params.porcentaje;
    if (params.descripcion !== undefined) updateObj.descripcion = params.descripcion?.trim() || null;
    if (params.orden !== undefined) updateObj.orden = params.orden;

    const { error } = await supabase
      .from("componentes_evaluacion")
      .update(updateObj)
      .eq("id", params.id);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

export async function eliminarComponenteEvaluacion(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabase.from("componentes_evaluacion").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

// ---------------- Calificaciones (Docente) ----------------

export async function guardarCalificacion(params: {
  componenteId: string;
  matriculaId: string;
  nota: number;
  retroalimentacion?: string | null | undefined;
}): Promise<{ ok: boolean; error?: string }> {
  if (params.nota < 0 || params.nota > 5) {
    return { ok: false, error: "La nota debe estar entre 0.0 y 5.0" };
  }

  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabase.from("calificaciones").upsert(
      {
        componente_id: params.componenteId,
        matricula_id: params.matriculaId,
        nota: params.nota,
        retroalimentacion: params.retroalimentacion?.trim() || null,
      },
      { onConflict: "componente_id,matricula_id" },
    );

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

export async function eliminarEntregaTrabajo(params: {
  entregaId: string;
  archivoUrl?: string | null | undefined;
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabase
      .from("entregas_trabajos")
      .delete()
      .eq("id", params.entregaId)
      .eq("estado", "entregado");

    if (error) return { ok: false, error: error.message };

    if (
      params.archivoUrl &&
      !params.archivoUrl.startsWith("http") &&
      !params.archivoUrl.startsWith("#")
    ) {
      await supabase.storage
        .from("evidencias-academicas")
        .remove([params.archivoUrl.replace(/^\/+/, "")]);
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

export async function calificarEntrega(params: {
  entregaId: string;
  nota: number;
  retroalimentacion?: string | null | undefined;
  componenteId?: string | null | undefined;
  matriculaId?: string | null | undefined;
}): Promise<{ ok: boolean; error?: string }> {
  if (params.nota < 0 || params.nota > 5) {
    return { ok: false, error: "La nota debe estar entre 0.0 y 5.0" };
  }
  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabase
      .from("entregas_trabajos")
      .update({
        nota: params.nota,
        retroalimentacion: params.retroalimentacion?.trim() || null,
        estado: "calificado",
      })
      .eq("id", params.entregaId);

    if (error) return { ok: false, error: error.message };

    if (params.componenteId && params.matriculaId) {
      const syncRes = await guardarCalificacion({
        componenteId: params.componenteId,
        matriculaId: params.matriculaId,
        nota: params.nota,
        retroalimentacion: params.retroalimentacion ?? null,
      });
      if (!syncRes.ok) {
        return {
          ok: false,
          error: `La entrega fue calificada, pero no se pudo sincronizar con el componente de evaluación: ${syncRes.error}`,
        };
      }
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

export async function crearObservacionAcademica(params: {
  matriculaId: string;
  tipo: "felicitacion" | "alerta_academica" | "asistencia" | "seguimiento";
  titulo: string;
  detalle: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabase.from("observaciones_academicas").insert({
      matricula_id: params.matriculaId,
      tipo: params.tipo,
      titulo: params.titulo.trim(),
      detalle: params.detalle.trim(),
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

export async function actualizarObservacionAcademica(params: {
  id: string;
  tipo: "felicitacion" | "alerta_academica" | "asistencia" | "seguimiento";
  titulo: string;
  detalle: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabase
      .from("observaciones_academicas")
      .update({
        tipo: params.tipo,
        titulo: params.titulo.trim(),
        detalle: params.detalle.trim(),
      })
      .eq("id", params.id);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

export async function eliminarObservacionAcademica(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabase.from("observaciones_academicas").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

export async function actualizarDetallesCursoDocente(params: {
  cursoId: string;
  horarioDescripcion?: string | null;
  aula?: string | null;
  descripcion?: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true };

  try {
    const { error } = await supabase
      .from("cursos")
      .update({
        horario_descripcion: params.horarioDescripcion?.trim() || null,
        aula: params.aula?.trim() || null,
        descripcion: params.descripcion?.trim() || null,
      })
      .eq("id", params.cursoId);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

export async function cerrarCursoDocente(
  cursoId: string,
): Promise<{ ok: boolean; filasAfectadas?: number; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: true, filasAfectadas: 1 };

  try {
    const { data, error } = await supabase.rpc("cerrar_curso", { p_curso_id: cursoId });
    if (error) return { ok: false, error: error.message };
    return { ok: true, filasAfectadas: Number(data) };
  } catch (err: any) {
    return { ok: false, error: err?.message || ERROR_SISTEMA_NO_DISPONIBLE };
  }
}

