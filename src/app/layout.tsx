import "./globals.css";
import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { ILayout } from "@/@types/interfaces/ILayout";
import initTranslations from "@/app/i18n";
import TranslationsProvider from "@/i18n/TranslationsProvider";
import AppLayout from "@/components/layout/AppLayout";
import { ProgressLoadingAtom } from "@/components/atom/ProgressLoadingAtom";

const cairo = Cairo({ subsets: ["arabic"] });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const i18nNamespaces = ["default"];

export default async function RootLayout({ children }: Readonly<ILayout>) {
  const { resources } = await initTranslations();

  return (
    <html className="light">
      <body
        className={`antialiased`}
        style={{
          fontFamily: `${cairo.style.fontFamily}, ${inter.style.fontFamily}`,
        }}
      >
        <TranslationsProvider resources={resources} namespaces={i18nNamespaces}>
          <ProgressLoadingAtom>
            <AppLayout>{children}</AppLayout>
          </ProgressLoadingAtom>
        </TranslationsProvider>
      </body>
    </html>
  );
}
