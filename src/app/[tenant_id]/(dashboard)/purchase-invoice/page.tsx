import PurchaseInvoiceViewPage from "@/components/pages/purchases/purchase-invoice/PurchaseInvoiceViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <PurchaseInvoiceViewPage tenantId={tenant_id} />;
}
