import ViewTaxesPage from "@/components/pages/taxes/ViewTaxesPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ViewTaxesPage tenantId={tenant_id} />;
}
