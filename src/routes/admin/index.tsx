import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Inbox,
  Mail,
  MessageCircle,
  Newspaper,
  Phone,
  PlusCircle,
  Sliders,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { programasAcademicos } from "@/data/programas";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Panel Administrativo | FUNASF" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

interface DashboardStats {
  programasCount: number;
  inscripcionesNuevas: number;
  mensajesNoLeidos: number;
  articulosCount: number;
}

interface RecentInscripcion {
  id: string;
  nombre_completo: string;
  programa_nombre: string;
  telefono: string;
  estado: string;
  created_at: string;
}

interface RecentMensaje {
  id: string;
  nombre: string;
  correo: string;
  asunto: string;
  leido: boolean;
  created_at: string;
}

function AdminDashboard() {
  const { profile, isConfigured } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    programasCount: programasAcademicos.length,
    inscripcionesNuevas: 0,
    mensajesNoLeidos: 0,
    articulosCount: 2,
  });
  const [recentInscripciones, setRecentInscripciones] = useState<RecentInscripcion[]>([]);
  const [recentMensajes, setRecentMensajes] = useState<RecentMensaje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!isConfigured) {
        // Datos de ejemplo para modo local
        setRecentInscripciones([
          {
            id: "1",
            nombre_completo: "Valentina Gómez",
            programa_nombre: "Auxiliar de Enfermería",
            telefono: "+57 315 889 4421",
            estado: "nuevo",
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "2",
            nombre_completo: "Carlos Andrés Peña",
            programa_nombre: "Seguridad y Salud en el Trabajo",
            telefono: "+57 318 442 1190",
            estado: "contactado",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
        setRecentMensajes([
          {
            id: "1",
            nombre: "Marcela Restrepo",
            correo: "marcela@example.com",
            asunto: "Información sobre becas 90%",
            leido: false,
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
        ]);
        setStats({
          programasCount: programasAcademicos.length,
          inscripcionesNuevas: 1,
          mensajesNoLeidos: 1,
          articulosCount: 2,
        });
        setLoading(false);
        return;
      }

      try {
        const [progRes, inscRes, msgRes, artRes, recentInscRes, recentMsgRes] = await Promise.all([
          supabase.from("programas").select("id", { count: "exact", head: true }),
          supabase
            .from("inscripciones")
            .select("id", { count: "exact", head: true })
            .eq("estado", "nuevo"),
          supabase
            .from("mensajes_contacto")
            .select("id", { count: "exact", head: true })
            .eq("leido", false),
          supabase.from("articulos").select("id", { count: "exact", head: true }),
          supabase
            .from("inscripciones")
            .select("id, nombre_completo, programa_nombre, telefono, estado, created_at")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("mensajes_contacto")
            .select("id, nombre, correo, asunto, leido, created_at")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        setStats({
          programasCount: progRes.count ?? programasAcademicos.length,
          inscripcionesNuevas: inscRes.count ?? 0,
          mensajesNoLeidos: msgRes.count ?? 0,
          articulosCount: artRes.count ?? 0,
        });

        if (recentInscRes.data) {
          setRecentInscripciones(recentInscRes.data as RecentInscripcion[]);
        }
        if (recentMsgRes.data) {
          setRecentMensajes(recentMsgRes.data as RecentMensaje[]);
        }
      } catch (err) {
        console.warn("Error cargando estadísticas del dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [isConfigured]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <AdminLayout
      title="Dashboard General"
      subtitle={`Bienvenido(a), ${profile?.nombre_completo || "Administrador"}. Aquí tienes un resumen operativo.`}
    >
      {/* Tarjetas de Métricas Principales */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Programas */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Programas Académicos
            </CardTitle>
            <div className="rounded-lg bg-brand-green/10 p-2 text-brand-green">
              <GraduationCap className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.programasCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Oferta formativa oficial activa</p>
            <div className="mt-3">
              <Button
                asChild
                variant="link"
                size="sm"
                className="p-0 h-auto text-brand-green text-xs"
              >
                <Link to="/admin/programas">Gestionar programas &rarr;</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inscripciones Nuevas */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inscripciones Nuevas
            </CardTitle>
            <div className="rounded-lg bg-brand-gold/15 p-2 text-brand-gold-deep">
              <UserCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground flex items-center gap-2">
              {stats.inscripcionesNuevas}
              {stats.inscripcionesNuevas > 0 && (
                <Badge className="bg-amber-500 text-white text-[10px]">Por revisar</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Postulaciones y solicitudes de beca
            </p>
            <div className="mt-3">
              <Button
                asChild
                variant="link"
                size="sm"
                className="p-0 h-auto text-brand-gold-deep text-xs"
              >
                <Link to="/admin/inscripciones">Ver aspirantes &rarr;</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mensajes de Contacto */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mensajes de Contacto
            </CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <Inbox className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground flex items-center gap-2">
              {stats.mensajesNoLeidos}
              {stats.mensajesNoLeidos > 0 && (
                <Badge variant="destructive" className="text-[10px]">
                  Sin leer
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Consultas desde la web pública</p>
            <div className="mt-3">
              <Button asChild variant="link" size="sm" className="p-0 h-auto text-blue-600 text-xs">
                <Link to="/admin/mensajes">Abrir buzón &rarr;</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Blog & Galería */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Artículos & Noticias
            </CardTitle>
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600">
              <Newspaper className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.articulosCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Publicaciones de la comunidad</p>
            <div className="mt-3">
              <Button
                asChild
                variant="link"
                size="sm"
                className="p-0 h-auto text-purple-600 text-xs"
              >
                <Link to="/admin/blog">Redactar artículo &rarr;</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <div className="mt-8">
        <h2 className="text-base font-semibold text-foreground mb-4">Acciones Rápidas</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            asChild
            variant="outline"
            className="h-auto p-4 justify-start border-dashed hover:border-brand-green hover:bg-brand-green/5"
          >
            <Link to="/admin/programas/nuevo">
              <PlusCircle className="size-5 text-brand-green mr-3 shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">Nuevo Programa</div>
                <div className="text-xs text-muted-foreground">Añadir oferta académica</div>
              </div>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto p-4 justify-start border-dashed hover:border-purple-600 hover:bg-purple-500/5"
          >
            <Link to="/admin/blog/nuevo">
              <PlusCircle className="size-5 text-purple-600 mr-3 shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">Nuevo Artículo</div>
                <div className="text-xs text-muted-foreground">Publicar en el blog</div>
              </div>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto p-4 justify-start border-dashed hover:border-brand-gold-deep hover:bg-brand-gold/5"
          >
            <Link to="/admin/galeria">
              <PlusCircle className="size-5 text-brand-gold-deep mr-3 shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">Subir Fotografías</div>
                <div className="text-xs text-muted-foreground">Actualizar la galería</div>
              </div>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto p-4 justify-start border-dashed hover:border-brand-brown hover:bg-brand-brown/5"
          >
            <Link to="/admin/configuracion">
              <Sliders className="size-5 text-brand-brown mr-3 shrink-0" />
              <div className="text-left">
                <div className="font-medium text-sm">Datos Institucionales</div>
                <div className="text-xs text-muted-foreground">Teléfonos, sedes y redes</div>
              </div>
            </Link>
          </Button>
        </div>
      </div>

      {/* Tablas de Actividad Reciente */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Últimas Inscripciones */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Últimas Inscripciones a Becas
              </CardTitle>
              <CardDescription>Aspirantes registrados recientemente</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/inscripciones">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentInscripciones.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No hay inscripciones registradas aún.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {recentInscripciones.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {item.nombre_completo}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.programa_nombre}
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="size-3" /> {formatDate(item.created_at)}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <Badge
                        variant={item.estado === "nuevo" ? "default" : "secondary"}
                        className="capitalize text-[11px]"
                      >
                        {item.estado}
                      </Badge>
                      {(() => {
                        const digits = item.telefono.replace(/\D/g, "");
                        const waNumber = digits.startsWith("57") ? digits : `57${digits}`;
                        return (
                          <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border border-border p-1.5 text-brand-green hover:bg-brand-green/10"
                            title="Contactar por WhatsApp"
                          >
                            <MessageCircle className="size-4" />
                          </a>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Últimos Mensajes de Contacto */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Mensajes de Contacto</CardTitle>
              <CardDescription>Consultas recibidas por la web</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/mensajes">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentMensajes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No hay mensajes pendientes en el buzón.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {recentMensajes.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground truncate">
                          {item.nombre}
                        </p>
                        {!item.leido && (
                          <span
                            className="size-2 rounded-full bg-blue-600 shrink-0"
                            title="No leído"
                          />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{item.asunto}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Mail className="size-3" /> {item.correo}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <Button asChild variant="ghost" size="sm" className="text-xs">
                        <Link to="/admin/mensajes">Leer</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
