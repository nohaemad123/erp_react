"use client";

import { I18nextProvider } from "react-i18next";
import initTranslations from "@/app/i18n";
import { Resource, createInstance } from "i18next";
import { useEffect } from "react";
import { getCookie } from "cookies-next";
import i18nConfig from "./i18nConfig";

export interface ITranslationsProvider {
  children: React.ReactNode;
  namespaces: string[];
  resources?: Resource;
}

export default function TranslationsProvider({ children, namespaces, resources }: Readonly<ITranslationsProvider>) {
  const i18n = createInstance();

  initTranslations(i18n.language, namespaces, i18n, resources);

  useEffect(() => {
    const lang = getCookie(i18nConfig.localeCookie) ?? "en";
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = i18n.dir(lang);
  }, [i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
