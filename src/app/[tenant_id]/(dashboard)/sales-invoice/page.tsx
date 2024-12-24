// import PurchaseInvoiceViewPage from "@/components/pages/purchases/purchase-invoice/PurchaseInvoiceViewPage";

import SalesInvoiceViewPage from "@/components/pages/sales/sales-invoice/SalesInvoiceViewPage";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <SalesInvoiceViewPage tenantId={tenant_id} />;
}
