import RepresentativesFormPage from "@/components/pages/representatives/RepresentativesFormPage";
import React from "react";

interface IRepresentativeViewProps {
  params: {
    representative_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { representative_id, tenant_id } }: Readonly<IRepresentativeViewProps>) {
  return <RepresentativesFormPage isEdit representativeId={representative_id} tenantId={tenant_id} />;
}
