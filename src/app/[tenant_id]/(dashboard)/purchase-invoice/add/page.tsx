import PurchaseInvoiceFormPage from "@/components/pages/purchases/purchase-invoice/PurchaseInvoiceFormPage";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <PurchaseInvoiceFormPage tenantId={tenant_id} />;
}
