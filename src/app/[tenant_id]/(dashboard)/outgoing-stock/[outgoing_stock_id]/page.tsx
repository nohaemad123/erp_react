import OutgoingStockFormPage from "@/components/pages/outgoing-stock/OutgoingStockFormPage";

interface IOutgoingStockViewProps {
  params: {
    outgoing_stock_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { outgoing_stock_id, tenant_id } }: Readonly<IOutgoingStockViewProps>) {
  return <OutgoingStockFormPage isView outgoingStockId={outgoing_stock_id} tenantId={tenant_id} />;
}
