"use client";

import SafeFormTemplate from "@/components/template/safe/SafeFormTemplate";

interface ISafeFormPageProps {
  tenantId: string;
  safeId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function SafeFormPage({ tenantId, safeId, isEdit, isView }: Readonly<ISafeFormPageProps>) {
  return (
    <section className="w-full p-8">
      <SafeFormTemplate safeId={safeId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
