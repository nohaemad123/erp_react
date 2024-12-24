import UnitFormPage from "@/components/pages/units/UnitsFormPage";
import React from "react";

interface IUnitViewProps {
  params: {
    unit_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { unit_id, tenant_id } }: Readonly<IUnitViewProps>) {
  return <UnitFormPage isView unitId={unit_id} tenantId={tenant_id} />;
}
