import RepresentativesFormPage from "@/components/pages/representatives/RepresentativesFormPage";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <RepresentativesFormPage tenantId={tenant_id} />;
}
