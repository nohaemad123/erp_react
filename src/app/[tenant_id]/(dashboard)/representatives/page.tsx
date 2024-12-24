import ViewRepresentativesPage from "@/components/pages/representatives/ViewRepresentativesPage";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ViewRepresentativesPage tenantId={tenant_id} />;
}
