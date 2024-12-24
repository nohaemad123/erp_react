"use client";

import { useTranslation } from "react-i18next";
import { setCookie } from "cookies-next";
import i18nConfig from "@/i18n/i18nConfig";
import { ButtonBase } from "@mui/material";

export default function LanguageChangerAtom() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;

  const handleChange = () => {
    const newLocale = currentLocale === "ar" ? "en" : "ar";
    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    setCookie(i18nConfig.localeCookie, newLocale, { expires: date });

    // redirect to the new locale path
    i18n.changeLanguage(newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = i18n.dir(newLocale);
  };

  return (
    <ButtonBase className="flex items-center justify-center self-center w-10 h-10 text-lg rounded" onClick={handleChange}>
      {currentLocale === "ar" ? "EN" : "AR"}
    </ButtonBase>
  );
}
