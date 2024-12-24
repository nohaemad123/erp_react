import TaxesFormPage from "@/components/pages/taxes/TaxesFormPage";
import React from "react";

interface ITaxViewProps {
  params: {
    tax_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { tax_id, tenant_id } }: Readonly<ITaxViewProps>) {
  return <TaxesFormPage isEdit taxId={tax_id} tenantId={tenant_id} />;
}
