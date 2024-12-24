import PurchaseReturnInvoiceViewPage from "@/components/pages/purchases/purchase-return-invoice/PurchaseReturnInvoiceViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <PurchaseReturnInvoiceViewPage tenantId={tenant_id} />;
}
