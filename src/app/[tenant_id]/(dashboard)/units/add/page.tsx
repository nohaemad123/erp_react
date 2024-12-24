import UnitsFormPage from "@/components/pages/units/UnitsFormPage";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <UnitsFormPage tenantId={tenant_id} />;
}
