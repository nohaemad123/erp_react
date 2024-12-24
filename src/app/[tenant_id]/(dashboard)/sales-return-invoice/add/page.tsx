import SalesReturnInvoiceFormPage from "@/components/pages/sales/sales-return-invoice/SalesReturnInvoiceFormPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <SalesReturnInvoiceFormPage tenantId={tenant_id} />;
}
