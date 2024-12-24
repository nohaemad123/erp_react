"use client";

import React from "react";
import UnitFormTemplate from "@/components/template/units/UnitsFormTemplate";

interface IUnitFormPageProps {
  tenantId: string;
  unitId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function UnitFormPage({ tenantId, unitId, isEdit, isView }: Readonly<IUnitFormPageProps>) {
  return (
    <section className="w-full p-8">
      <UnitFormTemplate unitId={unitId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
