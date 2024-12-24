import OutgoingStockViewPage from "@/components/pages/outgoing-stock/OutgoingStockViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <OutgoingStockViewPage tenantId={tenant_id} />;
}
