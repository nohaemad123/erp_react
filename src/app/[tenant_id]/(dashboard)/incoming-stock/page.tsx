import IncomingStockViewPage from "@/components/pages/incoming-stock/IncomingStockViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <IncomingStockViewPage tenantId={tenant_id} />;
}
