import SalesReturnInvoiceFormPage from "@/components/pages/sales/sales-return-invoice/SalesReturnInvoiceFormPage";

interface IPage {
  params: {
    invoice_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { invoice_id, tenant_id } }: Readonly<IPage>) {
  return <SalesReturnInvoiceFormPage tenantId={tenant_id} isEdit invoiceId={invoice_id} />;
}
