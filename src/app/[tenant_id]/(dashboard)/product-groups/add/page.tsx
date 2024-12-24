import ProductGroupFormPage from "@/components/pages/product-groups/ProductGroupFormPage";
import React from "react";

interface IPage {
  params: {
    tenant_id: string;
  };
}

export default function page({ params: { tenant_id } }: Readonly<IPage>) {
  return <ProductGroupFormPage tenantId={tenant_id} />;
}
