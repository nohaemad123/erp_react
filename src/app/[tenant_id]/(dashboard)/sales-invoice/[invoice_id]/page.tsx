import SalesInvoiceFormPage from "@/components/pages/sales/sales-invoice/SalesInvoiceFormPage";

interface IPage {
  params: {
    invoice_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { invoice_id, tenant_id } }: Readonly<IPage>) {
  return <SalesInvoiceFormPage tenantId={tenant_id} isView invoiceId={invoice_id} />;
}
