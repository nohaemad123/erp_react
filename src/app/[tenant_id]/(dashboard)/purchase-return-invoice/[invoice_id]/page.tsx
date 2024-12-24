import PurchaseReturnInvoiceFormPage from "@/components/pages/purchases/purchase-return-invoice/PurchaseReturnInvoiceFormPage";

interface IPage {
  params: {
    invoice_id: string;
    tenant_id: string;
  };
}

export default function page({ params: { invoice_id, tenant_id } }: Readonly<IPage>) {
  return <PurchaseReturnInvoiceFormPage tenantId={tenant_id} isView invoiceId={invoice_id} />;
}
