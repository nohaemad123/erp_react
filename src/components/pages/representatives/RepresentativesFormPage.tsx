"use client";

import React from "react";
import RepresentativesFormTemplate from "@/components/template/representatives/RepresentativesFormTemplate";

interface IRepresentativeFormPageProps {
  tenantId: string;
  representativeId?: string;
  isEdit?: boolean;
  isView?: boolean;
}

export default function RepresentativesFormPage({
  tenantId,
  representativeId,
  isEdit,
  isView,
}: Readonly<IRepresentativeFormPageProps>) {
  return (
    <section className="w-full p-8">
      <RepresentativesFormTemplate representativeId={representativeId} isEdit={isEdit} isView={isView} tenantId={tenantId} />
    </section>
  );
}
