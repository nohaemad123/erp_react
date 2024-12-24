import ViewUnitsPage from "@/components/pages/units/ViewUnitsPage";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ViewUnitsPage tenantId={tenant_id} />;
}
