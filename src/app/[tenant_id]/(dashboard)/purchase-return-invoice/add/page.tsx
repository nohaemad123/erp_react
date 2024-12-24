import PurchaseReturnInvoiceFormPage from "@/components/pages/purchases/purchase-return-invoice/PurchaseReturnInvoiceFormPage";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <PurchaseReturnInvoiceFormPage tenantId={tenant_id} />;
}
