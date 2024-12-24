import IncomingStockFormPage from "@/components/pages/incoming-stock/IncomingStockFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <IncomingStockFormPage tenantId={tenant_id} />;
}
