import AddTaxesPage from "@/components/pages/taxes/TaxesFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <AddTaxesPage tenantId={tenant_id} />;
}
