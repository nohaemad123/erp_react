import SafeFormPage from "@/components/pages/safe/SafeFormPage";
import React from "react";
interface ISafeViewProps {
  params: {
    safe_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { safe_id, tenant_id } }: Readonly<ISafeViewProps>) {
  return <SafeFormPage isView safeId={safe_id} tenantId={tenant_id} />;
}
