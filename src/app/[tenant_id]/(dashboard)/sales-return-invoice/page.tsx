import SalesReturnInvoiceViewPage from "@/components/pages/sales/sales-return-invoice/SalesReturnInvoiceViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <SalesReturnInvoiceViewPage tenantId={tenant_id} />;
}
