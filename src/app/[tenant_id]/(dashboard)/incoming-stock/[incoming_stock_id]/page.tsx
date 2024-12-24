import IncomingStockFormPage from "@/components/pages/incoming-stock/IncomingStockFormPage";

interface IIncomingStockViewProps {
  params: {
    incoming_stock_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { incoming_stock_id, tenant_id } }: Readonly<IIncomingStockViewProps>) {
  return <IncomingStockFormPage isView incomingStockId={incoming_stock_id} tenantId={tenant_id} />;
}
