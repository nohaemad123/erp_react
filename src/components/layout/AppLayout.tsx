"use client";

import { ILayout } from "@/@types/interfaces/ILayout";
import { ltrTheme, rtlTheme } from "@/lib/theme";
import { ThemeProvider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CacheProvider } from "@emotion/react";
import RouteGuard from "@/guard/RouteGuard";
import { SnackbarProvider } from "notistack";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

export const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export const cacheLtr = createCache({
  key: "mui",
  stylisPlugins: [prefixer],
});

export default function AppLayout({ children }: Readonly<ILayout>) {
  const { i18n } = useTranslation();

  return (
    <CacheProvider value={i18n.dir(i18n.language) === "rtl" ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={i18n.dir(i18n.language) === "rtl" ? rtlTheme : ltrTheme}>
        <SnackbarProvider>
          <RouteGuard>{children}</RouteGuard>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
