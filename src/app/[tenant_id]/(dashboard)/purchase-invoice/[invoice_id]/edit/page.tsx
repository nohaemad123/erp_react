import PurchaseInvoiceFormPage from "@/components/pages/purchases/purchase-invoice/PurchaseInvoiceFormPage";

interface IPage {
  params: {
    invoice_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { invoice_id, tenant_id } }: Readonly<IPage>) {
  return <PurchaseInvoiceFormPage tenantId={tenant_id} isEdit invoiceId={invoice_id} />;
}
