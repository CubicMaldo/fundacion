import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  getSiteSettings,
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/services/api";

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SITE_SETTINGS,
  isLoading: false,
  refreshSettings: async () => {},
});

interface SiteSettingsProviderProps {
  children: ReactNode;
  initialSettings?: SiteSettings;
}

export function SiteSettingsProvider({
  children,
  initialSettings,
}: SiteSettingsProviderProps) {
  const [settings, setSettings] = useState<SiteSettings>(
    initialSettings || DEFAULT_SITE_SETTINGS,
  );
  const [isLoading, setIsLoading] = useState(false);

  const refreshSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const fresh = await getSiteSettings();
      setSettings(fresh);
    } catch (err) {
      console.warn("[SiteSettingsProvider] Error refreshing site settings:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Si no se pasaron initialSettings o para asegurar sincronización en cliente
    refreshSettings();
  }, [refreshSettings]);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings debe ser utilizado dentro de un SiteSettingsProvider");
  }
  return context;
}
