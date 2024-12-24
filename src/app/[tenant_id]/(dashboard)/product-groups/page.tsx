import ProductGroupsViewPage from "@/components/pages/product-groups/ProductGroupsViewPage";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ProductGroupsViewPage tenantId={tenant_id} />;
}
