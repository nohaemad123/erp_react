"use client";

import { ILayout } from "@/@types/interfaces/ILayout";
import AuthHeaderOrganism from "@/components/organisms/auth/AuthHeaderOrganism";
import { useAppStore } from "@/store";

export default function IdentityLayout({ children }: Readonly<ILayout>) {
  const { myUser } = useAppStore();

  if (myUser) return <></>;

  return (
    <>
      <AuthHeaderOrganism />
      {children}
    </>
  );
}
