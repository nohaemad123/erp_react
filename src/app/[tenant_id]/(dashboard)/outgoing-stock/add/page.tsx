import OutgoingStockFormPage from "@/components/pages/outgoing-stock/OutgoingStockFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <OutgoingStockFormPage tenantId={tenant_id} />;
}
