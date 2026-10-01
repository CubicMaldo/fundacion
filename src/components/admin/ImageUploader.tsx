import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2, Link2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: "galeria" | "articulos";
  label?: string;
  helperText?: string;
  aspectRatio?: "video" | "square" | "wide";
}

export function ImageUploader({
  value,
  onChange,
  bucket = "galeria",
  label = "Imagen de portada / fotografía",
  helperText = "Formatos soportados: JPG, PNG, WebP (máx. 5 MB)",
  aspectRatio = "video",
}: ImageUploaderProps) {
  const { isConfigured } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    setErrorMsg(null);

    // Validación de tamaño (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("La imagen excede el límite de 5 MB. Por favor elige una imagen más ligera.");
      return;
    }

    // Validación de tipo
    if (!file.type.startsWith("image/")) {
      setErrorMsg("El archivo seleccionado no es una imagen válida.");
      return;
    }

    if (!isConfigured) {
      // Modo local: creamos una URL de objeto temporal para previsualización
      const localUrl = URL.createObjectURL(file);
      onChange(localUrl);
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop() || "jpg";
      const cleanFileName = file.name
        .substring(0, file.name.lastIndexOf("."))
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .substring(0, 30);
      const filePath = `${cleanFileName}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        onChange(publicUrlData.publicUrl);
      }
    } catch (err) {
      console.error("[ImageUploader] Error al subir imagen:", err);
      setErrorMsg(
        "No se pudo completar la subida. Verifica tu conexión o ingresa un enlace directo.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange("");
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "wide"
        ? "aspect-[21/9]"
        : "aspect-video";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-xs text-brand-green hover:text-brand-green-deep hover:underline flex items-center gap-1"
        >
          <Link2 className="size-3" />
          {showManualUrl ? "Subir archivo" : "Pegar URL externa"}
        </button>
      </div>

      {showManualUrl ? (
        <div className="space-y-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg o https://images.unsplash.com/..."
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Ingresa una URL directa a una imagen pública en internet.
          </p>
        </div>
      ) : value ? (
        <div className="relative group overflow-hidden rounded-xl border border-border bg-muted/40">
          <div className={`${aspectClass} w-full overflow-hidden flex items-center justify-center bg-black/5`}>
            <img
              src={value}
              alt="Vista previa"
              loading="lazy"
              className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="h-8 gap-1.5 shadow-md"
            >
              <X className="size-3.5" /> Quitar imagen
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 gap-1.5 shadow-md"
            >
              <UploadCloud className="size-3.5" /> Cambiar
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragActive
              ? "border-brand-green bg-brand-green/5"
              : "border-border hover:border-brand-green/50 hover:bg-muted/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            onChange={handleFileInputChange}
            disabled={uploading}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="size-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
              {uploading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <UploadCloud className="size-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {uploading ? "Subiendo imagen a Supabase..." : "Haz clic para subir o arrastra una imagen aquí"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{helperText}</p>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-destructive mt-1 font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
