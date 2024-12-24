import SafeFormPage from "@/components/pages/safe/SafeFormPage";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <SafeFormPage tenantId={tenant_id} />;
}
