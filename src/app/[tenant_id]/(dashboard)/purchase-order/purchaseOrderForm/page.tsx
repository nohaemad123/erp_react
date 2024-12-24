import PurchaseOrderForm from "@/components/pages/purchases/purchase-order/PurchaseOrderForm";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <PurchaseOrderForm tenantId={tenant_id} />;
}
