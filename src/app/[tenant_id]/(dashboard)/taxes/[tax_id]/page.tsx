import TaxesFormPage from "@/components/pages/taxes/TaxesFormPage";

interface ITaxViewProps {
  params: {
    tax_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { tax_id, tenant_id } }: Readonly<ITaxViewProps>) {
  return <TaxesFormPage isView taxId={tax_id} tenantId={tenant_id} />;
}
