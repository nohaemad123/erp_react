import SalesOrderForm from "@/components/pages/sales/sales-order/SalesOrderForm";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <SalesOrderForm tenantId={tenant_id} />;
}
